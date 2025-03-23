// src/routes/sensorTypeRoutes.ts
import { Router } from 'express';
import { getSensorTypes, createSensorType, updateSensorType, deleteSensorType } from '../controllers/sensorTypeController';

const router = Router();

router.get('/', getSensorTypes);                    // GET /sensor-types
router.post('/', createSensorType);                 // POST /sensor-types
// router.put('/:id', updateSensorType);               // PUT /sensor-types/:id
// router.delete('/:id', deleteSensorType);            // DELETE /sensor-types/:id

export default router;
