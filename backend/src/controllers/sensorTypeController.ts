// src/controllers/sensorTypeController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const getSensorTypes = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM SensorTypes');
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sensor types', message: error.message });
  }
};

export const createSensorType = async (req: Request, res: Response):Promise<any> => {
  const { sensor_type_name, unit, low_threshold, high_threshold } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO SensorTypes (sensor_type_name, unit, low_threshold, high_threshold)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sensor_type_name, unit, low_threshold, high_threshold]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create sensor type', message: error.message });
  }
};

export const updateSensorType = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  const { sensor_type_name, unit, low_threshold, high_threshold } = req.body;
  try {
    const result = await pool.query(
      `UPDATE SensorTypes
       SET sensor_type_name = COALESCE($2, sensor_type_name),
           unit = COALESCE($3, unit),
           low_threshold = COALESCE($4, low_threshold),
           high_threshold = COALESCE($4, high_threshold),
       WHERE sensor_type_id = $1
       RETURNING *`,
      [id, sensor_type_name, unit, low_threshold, high_threshold]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Sensor type not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update sensor type', message: error.message });
  }
};

export const deleteSensorType = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM SensorTypes WHERE sensor_type_id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Sensor type not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete sensor type', message: error.message });
  }
};
