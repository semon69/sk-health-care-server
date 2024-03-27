import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../../helpers/sendResponse";
import httpStatus from "http-status";

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

export const userController = {
  createAdmin,
};
