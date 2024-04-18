import { Request, Response } from 'express';
import { catchAsync } from '../../../helpers/catchAsync';
import { ScheduleService } from './schedule.service';
import sendResponse from '../../../helpers/sendResponse';
import httpStatus from 'http-status';
import { pick } from '../../../shared/pick';
import { TAuthUser } from '../../interfaces/common';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
  const filters = pick(req.query, ['startDate','endDate']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const user = req.user;
  const result = await ScheduleService.getAllFromDB(filters, options, user as TAuthUser);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule retrieval successfully',
    meta: result.meta,
    data: result.data,
    // data: result
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule retrieval successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule deleted successfully',
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
};