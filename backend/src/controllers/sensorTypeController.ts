// src/controllers/sensorTypeController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const getSensorTypes = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM SensorTypes');
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Error fetching sensor types:', error);
    res.status(500).json({
      error: 'Failed to fetch sensor types from database',
      message: `Database error: ${error.message}`,
      details: error.code || 'UNKNOWN_ERROR'
    });
  }
};

export const createSensorType = async (req: Request, res: Response): Promise<any> => {
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
    console.error('Error creating sensor type:', error);
    if (error.code === '23505') {
      res.status(409).json({
        error: 'Sensor type already exists',
        message: `A sensor type with name '${sensor_type_name}' already exists`,
        sensor_type_name,
        details: 'DUPLICATE_SENSOR_TYPE'
      });
    } else if (error.code === '23502') {
      res.status(400).json({
        error: 'Missing required fields',
        message: `sensor_type_name and unit are required to create a sensor type`,
        details: 'NOT_NULL_VIOLATION'
      });
    } else {
      res.status(500).json({
        error: 'Failed to create sensor type',
        message: `Database error while creating sensor type: ${error.message}`,
        details: error.code || 'UNKNOWN_ERROR'
      });
    }
  }
};

export const updateSensorType = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { sensor_type_name, unit, low_threshold, high_threshold } = req.body;
  try {
    const result = await pool.query(
      `UPDATE SensorTypes
       SET sensor_type_name = COALESCE($2, sensor_type_name),
           unit = COALESCE($3, unit),
           low_threshold = COALESCE($4, low_threshold),
           high_threshold = COALESCE($5, high_threshold)
       WHERE sensor_type_id = $1
       RETURNING *`,
      [id, sensor_type_name, unit, low_threshold, high_threshold]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Sensor type not found',
        message: `Cannot update: sensor type with ID ${id} does not exist`,
        sensor_type_id: id
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error(`Error updating sensor type ${id}:`, error);
    if (error.code === '23505') {
      res.status(409).json({
        error: 'Duplicate sensor type name',
        message: `Another sensor type with name '${sensor_type_name}' already exists`,
        details: 'DUPLICATE_SENSOR_TYPE'
      });
    } else {
      res.status(500).json({
        error: 'Failed to update sensor type',
        message: `Database error while updating sensor type ${id}: ${error.message}`,
        sensor_type_id: id,
        details: error.code || 'UNKNOWN_ERROR'
      });
    }
  }
};

export const deleteSensorType = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM SensorTypes WHERE sensor_type_id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Sensor type not found',
        message: `Cannot delete: sensor type with ID ${id} does not exist`,
        sensor_type_id: id
      });
    }
    res.status(204).send();
  } catch (error: any) {
    console.error(`Error deleting sensor type ${id}:`, error);
    // Check for foreign key constraint violations (sensors using this type)
    if (error.code === '23503') {
      res.status(409).json({
        error: 'Cannot delete sensor type',
        message: `Sensor type ${id} is in use by existing sensors. Remove those sensors first before deleting the type.`,
        sensor_type_id: id,
        details: 'FOREIGN_KEY_VIOLATION'
      });
    } else {
      res.status(500).json({
        error: 'Failed to delete sensor type',
        message: `Database error while deleting sensor type ${id}: ${error.message}`,
        sensor_type_id: id,
        details: error.code || 'UNKNOWN_ERROR'
      });
    }
  }
};
