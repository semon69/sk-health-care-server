import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllAdminFromDb = async (req: Request, res: Response) => {
  try {

    const filters = pick(req.query, adminFilterableFields);
    // console.log(filters);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    // console.log("options", options);


    const result = await adminService.getAllAdminFromDb(filters, options);
    res.status(200).send({
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

const getByIdFromDB = async(req: Request, res: Response)=> {
  try {
    const {id} = req.params;
    const result = await adminService.getByIdFromDB(id)
    res.status(200).send({
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
}

const updateDataIntoDB = async(req: Request, res: Response)=> {
  try {
    const {id} = req.params;
    const result = await adminService.updateDataIntoDB(id, req.body)
    res.status(200).send({
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
}

export const adminController = {
  getAllAdminFromDb,
  getByIdFromDB,
  updateDataIntoDB
};
