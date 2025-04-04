// src/routes/alertRoutes.ts
import { Router } from 'express';
import { getAlerts,getAlertLogs } from '../controllers/alertController';

const router = Router();

router.get('/', getAlerts);                       // GET /alerts
router.get('/logs',getAlertLogs);
// router.post('/', createAlert);                    // POST /alerts
// router.put('/:id', updateAlert);                  // PUT /alerts/:id
// router.delete('/:id', deleteAlert);               // DELETE /alerts/:id

export default router;
