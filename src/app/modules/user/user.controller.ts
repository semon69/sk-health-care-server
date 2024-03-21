import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../../helpers/sendResponse";
import httpStatus from "http-status";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdmin(req.body);
    sendResponse(res,{
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
    
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error?.name,
      error,
    });
  }
};

export const userController = {
  createAdmin,
};
