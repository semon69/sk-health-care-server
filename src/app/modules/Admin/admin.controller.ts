import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../helpers/sendResponse";
import httpStatus from "http-status";

const getAllAdminFromDb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getByIdFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminService.getByIdFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "An Admin data fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateDataIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminService.updateDataIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDataIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteDataFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data Deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteDataIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminService.softDeleteDataFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data Deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getAllAdminFromDb,
  getByIdFromDB,
  updateDataIntoDB,
  deleteDataIntoDB,
  softDeleteDataIntoDB,
};
