import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdmin(req.body);
    // res.send(result)
    res.status(200).send({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
        success: false,
        message: error?.name,
        error
    })
  }
};

export const userController = {
  createAdmin,
};
