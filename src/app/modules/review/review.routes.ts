import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { UserRole } from '@prisma/client';
import { ReviewValidation } from './reiew.validation';
import { auth } from '../../middlewares/auth';

const router = express.Router();
router.get('/', ReviewController.getAllFromDB);

router.post(
  '/',
  auth(UserRole.PATIENT),
  validateRequest(ReviewValidation.create),
  ReviewController.insertIntoDB,
);

export const ReviewRoutes = router;