// src/routes/sensorRoutes.ts
import { Router } from 'express';
import { getSensors, getSensorById, createSensor, updateSensor, deleteSensor } from '../controllers/sensorController';

const router = Router();

router.get('/', getSensors);                        // GET /sensors
// router.get('/:id', getSensorById);                    // GET /sensors/:id
router.post('/', createSensor);                       // POST /sensors
// router.put('/:id', updateSensor);                     // PUT /sensors/:id
// router.delete('/:id', deleteSensor);                  // DELETE /sensors/:id

export default router;
