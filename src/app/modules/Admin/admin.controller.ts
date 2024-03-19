import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllAdminFromDb = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllAdminFromDb(req.query);
    res.status(200).send({
      success: true,
      message: "Admin data fetched successfully",
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
};
