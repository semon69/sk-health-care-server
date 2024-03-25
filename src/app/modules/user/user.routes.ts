import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { UserRole } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelperrs";
import config from "../../config";
import { Secret } from "jsonwebtoken";

const router = express.Router();

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      // console.log(token);
      if (!token) {
        throw new Error("Unauthorized Access!");
      }
      const decodedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );
      if (roles.length && !roles.includes(decodedUser.role)) {
        throw new Error("Unauthorized access");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.createAdmin
);

export const UserRoutes = router;
