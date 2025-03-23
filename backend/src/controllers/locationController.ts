// src/controllers/locationController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const getLocations = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM locations');
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch locations', message: error.message });
  }
};

export const createLocation = async (req: Request, res: Response):Promise<any> => {
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
    res.status(500).json({ error: 'Failed to create location', message: error.message });
  }
};

export const updateLocation = async (req: Request, res: Response):Promise<any> => {
  console.log(req);
  const { id } = req.params;
  const { building, room_number, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE locations
       SET building = COALESCE($2, building),
           room_number = COALESCE($3, room_number),
           description = COALESCE($4, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE location_id = $1
       RETURNING *`,
      [id, building, room_number, description]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update location', message: error.message });
  }
};

export const deleteLocation = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM locations WHERE location_id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete location', message: error.message });
  }
};
