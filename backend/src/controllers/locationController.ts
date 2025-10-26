// src/controllers/locationController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const getLocations = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM locations');
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      error: 'Failed to fetch locations from database',
      message: `Database error: ${error.message}`,
      details: error.code || 'UNKNOWN_ERROR'
    });
  }
};

export const createLocation = async (req: Request, res: Response): Promise<any> => {
  const { building, room_number, description } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      `INSERT INTO locations (building, room_number, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [building, room_number, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating location:', error);
    // Check for unique constraint violation (duplicate location)
    if (error.code === '23505') {
      res.status(409).json({
        error: 'Location already exists',
        message: `Location ${building}-${room_number} already exists in the database`,
        building,
        room_number,
        details: 'DUPLICATE_LOCATION'
      });
    } else if (error.code === '23502') {
      res.status(400).json({
        error: 'Missing required fields',
        message: `Building and room_number are required to create a location`,
        details: 'NOT_NULL_VIOLATION'
      });
    } else {
      res.status(500).json({
        error: 'Failed to create location',
        message: `Database error while creating location: ${error.message}`,
        details: error.code || 'UNKNOWN_ERROR'
      });
    }
  }
};

export const updateLocation = async (req: Request, res: Response): Promise<any> => {
  const { locationID } = req.params;
  const { building, room_number, description } = req.body;
  console.log(building, room_number, description, locationID);
  try {
    const result = await pool.query(
      `UPDATE locations
       SET building = COALESCE($2, building),
           room_number = COALESCE($3, room_number),
           description = COALESCE($4, description)
       WHERE location_id = $1
       RETURNING *`,
      [locationID, building, room_number, description]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Location not found',
        message: `Cannot update: location with ID ${locationID} does not exist`,
        location_id: locationID
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error(`Error updating location ${locationID}:`, error);
    if (error.code === '23505') {
      res.status(409).json({
        error: 'Duplicate location',
        message: `Another location already exists with building ${building} and room ${room_number}`,
        details: 'DUPLICATE_LOCATION'
      });
    } else {
      res.status(500).json({
        error: 'Failed to update location',
        message: `Database error while updating location ${locationID}: ${error.message}`,
        location_id: locationID,
        details: error.code || 'UNKNOWN_ERROR'
      });
    }
  }
};

export const deleteLocation = async (req: Request, res: Response): Promise<any> => {
  const { locationID } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM locations WHERE location_id = $1`,
      [locationID]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Location not found',
        message: `Cannot delete: location with ID ${locationID} does not exist`,
        location_id: locationID
      });
    }
    res.status(204).send();
  } catch (error: any) {
    console.error(`Error deleting location ${locationID}:`, error);
    // Check for foreign key constraint violations (sensors still at location)
    if (error.code === '23503') {
      res.status(409).json({
        error: 'Cannot delete location',
        message: `Location ${locationID} has sensors installed. Remove all sensors first before deleting the location.`,
        location_id: locationID,
        details: 'FOREIGN_KEY_VIOLATION'
      });
    } else {
      res.status(500).json({
        error: 'Failed to delete location',
        message: `Database error while deleting location ${locationID}: ${error.message}`,
        location_id: locationID,
        details: error.code || 'UNKNOWN_ERROR'
      });
    }
  }
};