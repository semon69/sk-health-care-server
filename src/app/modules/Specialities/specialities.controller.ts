import { Request, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse";
import { specialitiesService } from "./specialities.services";
import { TFile } from "../../interfaces/file";
import httpStatus from "http-status";

const insertIntoDb = catchAsync(async (req: Request , res: Response) => {
  const result = await specialitiesService.insertIntoDb(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Create doctor specialities",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialitiesService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Specialties data fetched successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialitiesService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Specialty deleted successfully',
    data: result,
  });
});


export const specialitiesController = {
  insertIntoDb,
  getAllFromDB,
  deleteFromDB
};
