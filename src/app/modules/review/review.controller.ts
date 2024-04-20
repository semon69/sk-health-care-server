import { Request, Response } from 'express';
import { catchAsync } from '../../../helpers/catchAsync';
import { TAuthUser } from '../../interfaces/common';
import { ReviewService } from './review.service';
import sendResponse from '../../../helpers/sendResponse';
import httpStatus from 'http-status';
import { pick } from '../../../shared/pick';
import { reviewFilterableFields } from './review.constant';

const insertIntoDB = catchAsync(async (req: Request & {user?: TAuthUser}, res: Response) => {
  const user = req.user;
  const result = await ReviewService.insertIntoDB(req.body, user as TAuthUser);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ReviewService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  insertIntoDB,
  getAllFromDB,
};