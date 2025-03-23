// src/controllers/sensorController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const getSensors = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM Sensors');
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sensors', message: error.message });
  }
};

export const getSensorById = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Sensors WHERE sensor_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sensor', message: error.message });
  }
};

export const createSensor = async (req: Request, res: Response):Promise<any> => {
  const { sensor_type_id, location_id, installation_date, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Sensors (sensor_type_id, location_id, installation_date, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sensor_type_id, location_id, installation_date, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create sensor', message: error.message });
  }
};

export const updateSensor = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  const { sensor_type_id, location_id, installation_date, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE Sensors
       SET sensor_type_id = COALESCE($2, sensor_type_id),
           location_id = COALESCE($3, location_id),
           installation_date = COALESCE($4, installation_date),
           status = COALESCE($5, status)
       WHERE sensor_id = $1
       RETURNING *`,
      [id, sensor_type_id, location_id, installation_date, status]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update sensor', message: error.message });
  }
};

export const deleteSensor = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Sensors WHERE sensor_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete sensor', message: error.message });
  }
};
