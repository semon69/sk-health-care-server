import { Request, Response } from "express";
import { adminService } from "./admin.service";

const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
    
  const finalObj: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

const getAllAdminFromDb = async (req: Request, res: Response) => {
  try {
    const params = pick(req.query, [
      "name",
      "email",
      "contactNumber",
      "searchTerm",
    ]);

    const result = await adminService.getAllAdminFromDb(params);
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
