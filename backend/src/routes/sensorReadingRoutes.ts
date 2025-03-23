// src/routes/sensorReadingRoutes.ts
import { Router } from 'express';
import { getSensorReadings, createSensorReading } from '../controllers/sensorReadingController';

const router = Router();

// Route to get all readings for a given sensor
router.get('/:sensorId/readings', getSensorReadings);  // GET /sensors/:sensorId/readings

// Route to create a new reading for a given sensor
router.post('/:sensorId/readings', createSensorReading);  // POST /sensors/:sensorId/readings

export default router;
