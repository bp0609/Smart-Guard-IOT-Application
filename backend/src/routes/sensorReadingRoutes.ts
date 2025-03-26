// src/routes/sensorReadingRoutes.ts
import { Router } from 'express';
import { getSensorReadings, createSensorReading, getSensorReadingsByLocation } from '../controllers/sensorReadingController';

const router = Router();

// Route to get all readings for a given sensor
router.get('/:sensorId/readings', getSensorReadings);  // GET /sensors/:sensorId/readings

router.post('/:sensorId/readings', createSensorReading);  // POST /sensors/:sensorId/readings

router.get('/:building/:room_number/readings', getSensorReadingsByLocation);  // GET /sensors/:building/:room_number/readings
export default router;
