import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import { fileUploaders } from "../../../helpers/fileUploaders";
import { specialitiesController } from "./specialities.controller";
import { specialitiesValidation } from "./specialities.validation";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    fileUploaders.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = specialitiesValidation.create.parse(JSON.parse(req.body.data))
      return specialitiesController.insertIntoDb(req, res, next);
    }
  );

export const SpecialitiesRoutes = router