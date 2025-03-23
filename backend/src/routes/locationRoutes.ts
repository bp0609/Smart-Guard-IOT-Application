// src/routes/locationRoutes.ts
import express from 'express';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../controllers/locationController';

const router = express.Router();

router.get('/', getLocations);                   // GET /locations
router.post('/', createLocation);                // POST /locations
router.put('/:id', updateLocation);              // PUT /locations/:id
router.delete('/:id', deleteLocation);           // DELETE /locations/:id

export default router;