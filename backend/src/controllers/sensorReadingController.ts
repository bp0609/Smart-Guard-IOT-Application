import dotenv from 'dotenv';
dotenv.config();
// src/controllers/sensorReadingController.ts
import { Request, Response } from 'express';
var nodemailer = require('nodemailer');
import pool from '../db';

export const getSensorReadings = async (req: Request, res: Response): Promise<any> => {
  const { sensorId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM SensorReadings WHERE sensor_id = $1 ORDER BY reading_time DESC LIMIT 200',
      [sensorId]
    );
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sensor readings', message: error.message });
  }
};

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cnprojectsmartguard@gmail.com',
    pass: process.env.APP_PASS
  }
});

var mailOptions = {
  from: 'cnprojectsmartguard@gmail.com',
  to: 'patelbhavik03.bp@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

interface Transporter {
  sendMail: (mailOptions: MailOptions, callback: (error: Error | null, info: { response: string }) => void) => void;
}

const typedTransporter: Transporter = transporter;

export const addSensorReading = async (req: Request, res: Response):Promise<any> => {
  const { sensorId } = req.params;
  let { reading_value } = req.body;
  try {
    const sensorTypeResult = await pool.query(
      `SELECT low_threshold, high_threshold
       FROM SensorTypes st
       JOIN Sensors s ON st.sensor_type_id = s.sensor_type_id
       WHERE s.sensor_id = $1`,
      [sensorId]
    );

    if (sensorTypeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor type not found' });
    }

    let { low_threshold, high_threshold } = sensorTypeResult.rows[0];
    
    const result = await pool.query(
      `INSERT INTO SensorReadings (sensor_id, reading_value)
       VALUES ($1, $2)
       RETURNING *`,
      [sensorId, reading_value]
    );
    low_threshold = low_threshold === null ? null : parseFloat(low_threshold);
    high_threshold = high_threshold === null ? null : parseFloat(high_threshold);
    reading_value = parseFloat(reading_value);
    let alertType="Unknown";
    if ((low_threshold && reading_value < low_threshold) || (high_threshold && reading_value > high_threshold)) {
      alertType = (low_threshold && reading_value < low_threshold) ? 'low' : 'high';
      const alertResult = await pool.query(
        `INSERT INTO Alerts (sensor_id, alert_time, reading_id, alert_type)
         VALUES ($1, NOW(), $2, $3)
         RETURNING *`,
        [sensorId, result.rows[0].reading_id, alertType]
      );
      if (alertResult.rowCount === 0) {
        return res.status(500).json({ error: 'Failed to create alert' });
      }
      // Notify the user about the alert
      // You can use a notification service or send an email here
      const locationDetails = await pool.query(
        `SELECT building, room_number
         FROM Locations
         WHERE location_id = (
           SELECT location_id
           FROM Sensors
           WHERE sensor_id = $1
         )`,
        [sensorId]
      );
      const sensorTypeNameResult = await pool.query(
        `SELECT st.sensor_type_name, st.unit
         FROM SensorTypes st
         JOIN Sensors s ON st.sensor_type_id = s.sensor_type_id
         WHERE s.sensor_id = $1`,
        [sensorId]
      );

      let sensorTypeName = "Unknown";
      let sensorUnit = "Unknown";
      if (sensorTypeNameResult.rows.length > 0) {
        sensorTypeName = sensorTypeNameResult.rows[0].sensor_type_name;
        sensorUnit = sensorTypeNameResult.rows[0].unit;
      }
      const adminEmailsResult = await pool.query(
        `SELECT email_id FROM Admins`
      );
      const adminEmails = adminEmailsResult.rows.map((row: { email_id: string }) => row.email_id);
      console.log(`${adminEmails}`);
      const typedMailOptions: MailOptions = {
        from: 'cnprojectsmartguard@gmail.com',
        to: `${adminEmails}`,
        subject: "",
        text: ""
      };
      if (locationDetails.rows.length > 0) {
        const { building, room_number } = locationDetails.rows[0];
        typedMailOptions.subject = `Alert: ${sensorTypeName} Sensor at location ${building}/${room_number} triggered`;
        typedMailOptions.text = `An alert has been triggered for ${sensorTypeName} sensor at location ${building}/${room_number}. The reading value is ${reading_value}${sensorUnit}.\nAlert Type: ${alertType}\nSensor ID: ${sensorId}\nAlert Time: ${alertResult.rows[0].alert_time}\nSensor Type: ${sensorTypeName}\nLow Threshold: ${low_threshold}${sensorUnit}\nHigh Threshold: ${high_threshold}${sensorUnit}`;
      } else {
        typedMailOptions.subject = `Alert: Sensor ${sensorId} triggered`;
        typedMailOptions.text = `An alert has been triggered for sensor ${sensorId}. The reading value is ${reading_value}.`;
      }

      typedTransporter.sendMail(typedMailOptions, function (error: Error | null, info: { response: string }) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log(`\n Alert created for sensor ${sensorId}: ${alertResult.rows[0].alert_time}`);
    }
    else{
      // make resolved column true for this sensor id
      console.log("\n Alert Resolved");
      const alertResult = await pool.query(
        `UPDATE Alerts
         SET resolved = true
         WHERE sensor_id = $1 AND resolved = false`,
        [sensorId]
      );
    }
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create sensor reading', message: error.message });
  }
};


export const getSensorReadingsByLocation = async (req: Request, res: Response): Promise<any> => {
  const { building, room_number, start_time, end_time } = req.params;
  console.log("Start time: ", start_time);
  console.log("End time: ", end_time);

  try {
    const locationResult = await pool.query(
      `SELECT location_id
       FROM Locations
       WHERE building = $1 AND room_number = $2`,
      [building, room_number]
    );

    if (locationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const locationId = locationResult.rows[0].location_id;

    // Fetch latest value for each sensor at the location (regardless of time range)
    const latestReadingsResult = await pool.query(
      `SELECT DISTINCT ON (s.sensor_id) s.sensor_id, sr.reading_value
       FROM Sensors s
       JOIN SensorReadings sr ON s.sensor_id = sr.sensor_id
       WHERE s.location_id = $1
       ORDER BY s.sensor_id, sr.reading_time DESC`,
      [locationId]
    );

    const latestValueMap: Record<string, number> = {};
    latestReadingsResult.rows.forEach(row => {
      latestValueMap[row.sensor_id] = row.reading_value;
    });

    // Main result query (filtered or top 100 latest)
    let result;
    if (start_time === "_" || end_time === "_") {
      result = await pool.query(
        `SELECT sensor_id, sensor_type_name, unit, reading_time, reading_value
         FROM (
           SELECT s.sensor_id,
                  st.sensor_type_name,
                  st.unit,
                  sr.reading_time,
                  sr.reading_value,
                  ROW_NUMBER() OVER (PARTITION BY s.sensor_id ORDER BY sr.reading_time DESC) as row_num
           FROM Sensors s
           JOIN SensorReadings sr ON s.sensor_id = sr.sensor_id
           JOIN SensorTypes st ON s.sensor_type_id = st.sensor_type_id
           WHERE s.location_id = $1
         ) ranked
         WHERE row_num <= 100`,
        [locationId]
      );
    } else {
      result = await pool.query(
        `SELECT s.sensor_id, st.sensor_type_name, st.unit, sr.reading_time, sr.reading_value
         FROM Sensors s
         JOIN SensorReadings sr ON s.sensor_id = sr.sensor_id
         JOIN SensorTypes st ON s.sensor_type_id = st.sensor_type_id
         WHERE s.location_id = $1 AND sr.reading_time BETWEEN $2 AND $3
         ORDER BY sr.reading_time DESC`,
        [locationId, `${start_time} 00:00:00`, `${end_time} 23:59:59`]
      );
    }

    const formattedResult: any[] = [];

    result.rows.forEach(row => {
      const formattedTime = new Date(row.reading_time).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: 'numeric',
        hour12: false
      }).replace(',', '').replace(' ', '-');

      let sensorData = formattedResult.find(sensor => sensor.sensor_id === row.sensor_id);
      if (!sensorData) {
        sensorData = {
          sensor_id: row.sensor_id,
          sensor_type: row.sensor_type_name,
          unit: row.unit,
          latest_value: latestValueMap[row.sensor_id] ?? null,
          sensor_data: {
            timestamps: [],
            readings: []
          }
        };
        formattedResult.push(sensorData);
      }

      sensorData.sensor_data.timestamps.push(formattedTime);
      sensorData.sensor_data.readings.push(row.reading_value);
    });

    res.status(200).json(formattedResult);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch sensor readings by location',
      message: error.message
    });
  }
};
