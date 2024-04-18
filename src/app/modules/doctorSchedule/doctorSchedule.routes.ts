import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ScheduleController } from './doctorSchedule.controller';
import { UserRole } from '@prisma/client';
import { auth } from '../../middlewares/auth';
import { DoctorScheduleValidation } from './doctorSchedule.validation';

const router = express.Router();
router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  ScheduleController.getAllFromDB);

router.get(
  '/my-schedules',
  auth(UserRole.DOCTOR),
  ScheduleController.getMySchedules
);

// router.patch('/:id', ScheduleController.updateIntoDB);
router.post(
  '/',
  validateRequest(DoctorScheduleValidation.create),
  auth(UserRole.DOCTOR),
  ScheduleController.insertIntoDB,
);
router.delete(
  '/:id',
  auth(UserRole.DOCTOR),
  ScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;