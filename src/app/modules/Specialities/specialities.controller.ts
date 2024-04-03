import { Request, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse";
import { specialitiesService } from "./specialities.services";
import { TFile } from "../../interfaces/file";

const insertIntoDb = catchAsync(async (req: Request , res: Response) => {
  const result = await specialitiesService.insertIntoDb(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Create doctor specialities",
    data: result,
  });
});

export const specialitiesController = {
  insertIntoDb,
};
