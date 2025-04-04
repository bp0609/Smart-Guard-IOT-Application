// src/controllers/alertController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const getAlertLogs = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM Alerts');
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch alerts', message: error.message });
  }
};

// sends {sensor_id,building, room_no, sensor_type_name, alert_time, alert_value}
export const getAlerts = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (sensor_id) sensor_id, reading_id,alert_time
       FROM Alerts
       WHERE resolved = false
       ORDER BY sensor_id, alert_time DESC`
    );
    if (result.rowCount === 0) {
      return res.status(200).json({ message: 'No alerts found' });
    }
    // const sensorIds = result.rows.map((row: any) => row.sensor_id);
    const readingIds = result.rows.map((row: any) => row.reading_id);
    const detailedResult = await pool.query(
      `SELECT s.sensor_id, l.building, l.room_number, st.sensor_type_name, a.alert_time, sr.reading_value, a.alert_type
       FROM SensorReadings sr
       JOIN Alerts a ON sr.reading_id = a.reading_id
       JOIN Sensors s ON sr.sensor_id = s.sensor_id
       JOIN locations l ON s.location_id = l.location_id
       JOIN SensorTypes st ON s.sensor_type_id = st.sensor_type_id
       WHERE a.resolved = false AND sr.reading_id = ANY($1::int[])
       ORDER BY a.alert_time DESC`,
      [readingIds]
    );

    res.status(200).json(detailedResult.rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch alerts', message: error.message });
  }
}

export const createAlert = async (req: Request, res: Response):Promise<any> => {
  const { sensor_id, reading_id, alert_type, alert_message } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Alerts (sensor_id, reading_id, alert_type, alert_message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sensor_id, reading_id, alert_type, alert_message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create alert', message: error.message });
  }
};
