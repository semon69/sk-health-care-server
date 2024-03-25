import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { UserRole } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelperrs";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.createAdmin
);

export const UserRoutes = router;
