// src/controllers/sensorReadingController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const getSensorReadings = async (req: Request, res: Response):Promise<any> => {
  const { sensorId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM SensorReadings WHERE sensor_id = $1 ORDER BY reading_time DESC',
      [sensorId]
    );
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sensor readings', message: error.message });
  }
};

export const createSensorReading = async (req: Request, res: Response):Promise<any> => {
  const { sensorId } = req.params;
  const { reading_value } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO SensorReadings (sensor_id, reading_value)
       VALUES ($1, $2)
       RETURNING *`,
      [sensorId, reading_value]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create sensor reading', message: error.message });
  }
};

export const getSensorReadingsByLocation = async (req: Request, res: Response):Promise<any> => {
  const { building, room_number} = req.params;
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

    const result = await pool.query(
      `SELECT s.sensor_id, st.sensor_type_name, sr.reading_time, sr.reading_value
       FROM Sensors s
       JOIN SensorReadings sr ON s.sensor_id = sr.sensor_id
       JOIN SensorTypes st ON s.sensor_type_id = st.sensor_type_id
       WHERE s.location_id = $1
       ORDER BY sr.reading_time DESC`,
      [locationId]
    );

    const formattedResult: Record<string, any> = {};

    result.rows.forEach(row => {
      const formattedTime = new Date(row.reading_time).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '').replace(' ', '-');

      if (!formattedResult[row.sensor_id]) {
        formattedResult[row.sensor_id] = {
          sensor_type: row.sensor_type_name,
          sensor_data: {}
        };
      }
      formattedResult[row.sensor_id].sensor_data[formattedTime] = row.reading_value;
    });

    res.status(200).json(formattedResult);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sensor readings by location', message: error.message });
  }
};