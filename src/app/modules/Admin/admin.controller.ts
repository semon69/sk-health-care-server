import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../helpers/sendResponse";

const getAllAdminFromDb = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    // console.log(filters);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    // console.log("options", options);

    const result = await adminService.getAllAdminFromDb(filters, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error?.name,
      error,
    });
  }
};

const getByIdFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.getByIdFromDB(id);
    // res.status(200).send({
    //   success: true,
    //   message: ,
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "An Admin data fetched successfully",
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

const updateDataIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.updateDataIntoDB(id, req.body);
    // res.status(200).send({
    //   success: true,
    //   message: "Admin data updated successfully",
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data updated successfully",
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

const deleteDataIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteDataFromDB(id);
    // res.status(200).send({
    //   success: true,
    //   message: 
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data Deleted successfully",
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

const softDeleteDataIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.softDeleteDataFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data Deleted successfully",
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

export const adminController = {
  getAllAdminFromDb,
  getByIdFromDB,
  updateDataIntoDB,
  deleteDataIntoDB,
  softDeleteDataIntoDB,
};
