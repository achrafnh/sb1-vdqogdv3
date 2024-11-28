import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', appointmentController.createAppointment);
router.get('/user', appointmentController.getUserAppointments);
router.patch('/:id/status', appointmentController.updateAppointmentStatus);

export default router;