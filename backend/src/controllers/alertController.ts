// src/controllers/alertController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const getAlerts = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM Alerts');
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch alerts', message: error.message });
  }
};

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

export const updateAlert = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  const { resolved } = req.body;
  try {
    const result = await pool.query(
      `UPDATE Alerts
       SET resolved = $2,
           alert_time = CURRENT_TIMESTAMP
       WHERE alert_id = $1
       RETURNING *`,
      [id, resolved]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update alert', message: error.message });
  }
};

export const deleteAlert = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Alerts WHERE alert_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete alert', message: error.message });
  }
};
