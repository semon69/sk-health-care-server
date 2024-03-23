import express from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validations';

const router = express.Router();

router.get('/', adminController.getAllAdminFromDb) 

router.get('/:id', adminController.getByIdFromDB) 

router.patch('/:id', validateRequest(adminValidationSchemas.update), adminController.updateDataIntoDB) 

router.delete('/:id', adminController.deleteDataIntoDB) 

router.delete('/soft/:id', adminController.softDeleteDataIntoDB) 

export const AdminRoutes = router