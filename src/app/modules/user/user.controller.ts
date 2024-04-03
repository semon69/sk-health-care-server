import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../../helpers/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../../helpers/catchAsync";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const result = await userServices.createAdmin(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createDoctor = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const result = await userServices.createDoctor(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createPaitent = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const result = await userServices.createPatient(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Paitent created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFromDb = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  // console.log("options", options);

  const result = await userServices.getAllFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users data fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const changeUserStatus = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await userServices.changeUserStatus(id, req.body );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await userServices.getMyProfile(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile data fetched successfully",
    data: result,
  });
});


export const userController = {
  createAdmin,
  createDoctor,
  createPaitent,
  getAllFromDb,
  changeUserStatus,
  getMyProfile
};
