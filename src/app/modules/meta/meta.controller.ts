import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { metaServices } from './meta.service';
import sendResponse from '../../../helpers/sendResponse';
import { catchAsync } from '../../../helpers/catchAsync';
import { TAuthUser } from '../../interfaces/common';

const fetchDashboardMetadata = catchAsync(async (req: Request & {user?: TAuthUser}, res: Response) => {
    const user = req.user;
    const result = await metaServices.fetchDashboardMetadata(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient retrieval successfully',
        data: result,
    });
});

export const MetaController = {
    fetchDashboardMetadata
};