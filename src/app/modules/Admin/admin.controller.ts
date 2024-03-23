import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../helpers/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../../helpers/catchAsync";

const getAllAdminFromDb: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  // console.log(filters);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  // console.log("options", options);

  const result = await adminService.getAllAdminFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "An Admin data fetched successfully",
    data: result,
  });
});

const updateDataIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.updateDataIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data updated successfully",
    data: result,
  });
});

const deleteDataIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.deleteDataFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data Deleted successfully",
    data: result,
  });
});

const softDeleteDataIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.softDeleteDataFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data Deleted successfully",
    data: result,
  });
});

export const adminController = {
  getAllAdminFromDb,
  getByIdFromDB,
  updateDataIntoDB,
  deleteDataIntoDB,
  softDeleteDataIntoDB,
};
