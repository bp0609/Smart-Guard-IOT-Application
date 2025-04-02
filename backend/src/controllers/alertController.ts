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
      return res.status(404).json({ message: 'No unresolved alerts found' });
    }

    const sensorIds = result.rows.map((row: any) => row.sensor_id);
    const readingIds = result.rows.map((row: any) => row.reading_id);
    console.log(sensorIds);
    const detailedResult = await pool.query(
      `SELECT s.sensor_id, l.building, l.room_number, st.sensor_type_name, a.alert_time, sr.reading_value
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
