import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelperrs";
import { Secret } from "jsonwebtoken";
import config from "../config";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

export const auth = (...roles: string[]) => {
  return async (req: Request & {user?: any}, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      // console.log(token);
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
      }
      const decodedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );
      
      req.user = decodedUser

      if (roles.length && !roles.includes(decodedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
