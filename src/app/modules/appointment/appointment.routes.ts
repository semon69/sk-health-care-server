import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AppointmentController } from './appointment.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';


const router = express.Router();

// router.get(
//     '/',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     AppointmentController.getAllFromDB
// );

// router.get(
//     '/my-appointments',
//     auth(UserRole.PATIENT, UserRole.DOCTOR),
//     AppointmentController.getMyAppointment
// );

router.post(
    '/',
    auth(UserRole.PATIENT),
    // validateRequest(AppointmentValidation.createAppointment),
    AppointmentController.createAppointment
);

// router.patch(
//     '/status/:id',
//     auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
//     AppointmentController.changeAppointmentStatus
// );



export const AppointmentRoutes = router;