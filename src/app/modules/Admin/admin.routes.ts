import express from 'express';
import app from '../../../app';
import { adminController } from './admin.controller';

const router = express.Router();

router.get('/', adminController.getAllAdminFromDb) 

export const AdminRoutes = router