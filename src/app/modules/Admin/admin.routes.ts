import express from 'express';
import app from '../../../app';
import { adminController } from './admin.controller';

const router = express.Router();

router.get('/', adminController.getAllAdminFromDb) 
router.get('/:id', adminController.getByIdFromDB) 

export const AdminRoutes = router