import express from 'express';
import { PaymentController } from './payment.controller';
import { UserRole } from '@prisma/client';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/ipn', PaymentController.validate)

router.post(
    '/init/:appointmentId',
    auth(UserRole.PATIENT),
    PaymentController.initPayment
);



export const paymentRoutes = router;
