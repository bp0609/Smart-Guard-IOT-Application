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
