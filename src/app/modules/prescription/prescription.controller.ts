import { Request, Response } from 'express';
import { catchAsync } from '../../../helpers/catchAsync';
import { TAuthUser } from '../../interfaces/common';
import sendResponse from '../../../helpers/sendResponse';
import httpStatus from 'http-status';
import { PrescriptionService } from './prescription.service';
import { prescriptionFilterableFields } from './prescription.constant';
import { pick } from '../../../shared/pick';


const insertIntoDB = catchAsync(async (req: Request & {user?: TAuthUser}, res: Response) => {
  const user = req.user;
  const result = await PrescriptionService.insertIntoDB(req.body, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Prescription created successfully',
    data: result,
  });
});

const patientPrescriptions = catchAsync(async (req: Request  & {user?: TAuthUser}, res: Response) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const user = req.user;
  const result = await PrescriptionService.patientPrescriptions(
    user,
    options,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Prescriptions retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, prescriptionFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await PrescriptionService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Prescriptions retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PrescriptionService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Prescriptions retrieval successfully',
    data: result,
  });
});

export const PrescriptionController = {
  insertIntoDB,
  patientPrescriptions,
  getAllFromDB,
  getByIdFromDB,
};