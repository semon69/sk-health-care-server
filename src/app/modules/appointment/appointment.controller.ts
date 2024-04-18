import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { TAuthUser } from '../../interfaces/common';
import { catchAsync } from '../../../helpers/catchAsync';
import { AppointmentServices } from './appointment.service';
import sendResponse from '../../../helpers/sendResponse';

const createAppointment = catchAsync(async (req: Request & {user?: TAuthUser}, res: Response) => {
    const user = req.user;
    const result = await AppointmentServices.createAppointment(req.body, user as TAuthUser);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment booked successfully!',
        data: result,
    });
});

// const getMyAppointment = catchAsync(async (req: Request & {user?: TAuthUser}, res: Response) => {
//     const filters = pick(req.query, appointmentFilterableFields);
//     const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
//     const user = req.user;
//     const result = await AppointmentServices.getMyAppointment(filters, options, user as IAuthUser);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Appointment retrieval successfully',
//         meta: result.meta,
//         data: result.data,
//     });
// });

// const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
//     const filters = pick(req.query, appointmentFilterableFields)
//     const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
//     const result = await AppointmentServices.getAllFromDB(filters, options);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Appointment retrieval successfully',
//         meta: result.meta,
//         data: result.data,
//     });
// });

// const changeAppointmentStatus = catchAsync(async (req: Request & {user?: TAuthUser}, res: Response) => {
//     const { id } = req.params;
//     const user = req.user;
//     const result = await AppointmentServices.changeAppointmentStatus(id, req.body.status, user);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Appointment status changed successfully',
//         data: result
//     });
// });

export const AppointmentController = {
    createAppointment,
    // getMyAppointment,
    // getAllFromDB,
    // changeAppointmentStatus
};