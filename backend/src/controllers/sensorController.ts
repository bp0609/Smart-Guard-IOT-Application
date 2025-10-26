// src/controllers/sensorController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const getSensors = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM Sensors');
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Error fetching sensors:', error);
    res.status(500).json({
      error: 'Failed to fetch sensors from database',
      message: `Database error: ${error.message}`,
      details: error.code || 'UNKNOWN_ERROR'
    });
  }
};

export const getSensorById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Sensors WHERE sensor_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Sensor not found',
        message: `No sensor exists with ID: ${id}`,
        sensor_id: id
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error(`Error fetching sensor ${id}:`, error);
    res.status(500).json({
      error: 'Failed to fetch sensor details',
      message: `Database error while fetching sensor ${id}: ${error.message}`,
      sensor_id: id
    });
  }
};

export const createSensor = async (req: Request, res: Response): Promise<any> => {
  const { sensor_type, building, room_number, installation_date, status } = req.body;
  try {
    // Validate location exists
    const location_id_result = await pool.query('SELECT location_id FROM Locations WHERE building = $1 AND room_number = $2', [building, room_number]);
    if (location_id_result.rowCount === 0) {
      return res.status(400).json({
        error: 'Location not found',
        message: `Location ${building}-${room_number} does not exist. Please create the location first.`,
        building,
        room_number
      });
    }
    const location_id = location_id_result.rows[0].location_id;

    // Validate sensor type exists
    const sensorTypeResult = await pool.query('SELECT * FROM sensortypes WHERE sensor_type_name = $1', [sensor_type]);
    if (sensorTypeResult.rowCount === 0) {
      return res.status(400).json({
        error: 'Sensor type not found',
        message: `Sensor type '${sensor_type}' is not valid. Available types can be fetched from /sensor_types endpoint.`,
        provided_sensor_type: sensor_type
      });
    }
    const sensor_type_id = sensorTypeResult.rows[0].sensor_type_id;

    // Check if sensor already exists at this location
    const existingSensor = await pool.query('SELECT sensor_id FROM Sensors WHERE sensor_type_id = $1 AND location_id = $2', [sensor_type_id, location_id]);
    if (existingSensor.rowCount && existingSensor.rowCount > 0) {
      return res.status(400).json({
        error: 'Sensor already exists',
        message: `A ${sensor_type} sensor already exists at location ${building}-${room_number}. Sensor ID: ${existingSensor.rows[0].sensor_id}`,
        existing_sensor_id: existingSensor.rows[0].sensor_id,
        location: `${building}-${room_number}`,
        sensor_type
      });
    }

    const result = await pool.query(
      `INSERT INTO Sensors (sensor_type_id, location_id, installation_date, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sensor_type_id, location_id, installation_date || (new Date()).toISOString(), status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating sensor:', error);
    res.status(500).json({
      error: 'Failed to add sensor',
      message: `Database error while creating sensor: ${error.message}`,
      details: error.code || 'UNKNOWN_ERROR'
    });
  }
};

export const updateSensor = async (req: Request, res: Response): Promise<any> => {
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
      return res.status(404).json({
        error: 'Sensor not found',
        message: `Cannot update: sensor with ID ${id} does not exist`,
        sensor_id: id
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error(`Error updating sensor ${id}:`, error);
    res.status(500).json({
      error: 'Failed to update sensor',
      message: `Database error while updating sensor ${id}: ${error.message}`,
      sensor_id: id,
      details: error.code || 'UNKNOWN_ERROR'
    });
  }
};

export const deleteSensor = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Sensors WHERE sensor_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Sensor not found',
        message: `Cannot delete: sensor with ID ${id} does not exist`,
        sensor_id: id
      });
    }
    res.status(204).send();
  } catch (error: any) {
    console.error(`Error deleting sensor ${id}:`, error);
    // Check for foreign key constraint violations
    if (error.code === '23503') {
      res.status(409).json({
        error: 'Cannot delete sensor',
        message: `Sensor ${id} has associated readings or alerts. Delete those first or contact administrator.`,
        sensor_id: id,
        details: 'FOREIGN_KEY_VIOLATION'
      });
    } else {
      res.status(500).json({
        error: 'Failed to delete sensor',
        message: `Database error while deleting sensor ${id}: ${error.message}`,
        sensor_id: id,
        details: error.code || 'UNKNOWN_ERROR'
      });
    }
  }
};
