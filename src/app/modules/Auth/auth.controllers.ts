import { Request, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse";
import { AuthService } from "./auth.services";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken } = result;
  //   console.log(refreshToken);
  res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successfull",
    data: {
      accessToken: result?.accessToken,
      needPasswordChange: result?.needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successfull",
    // data: result
    data: {
      accessToken: result?.accessToken,
      needPasswordChange: result?.needPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req: Request & {user?: any}, res: Response) => {
  const user = req?.user;

  const result = await AuthService.changePassword(user, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfull",
    data: result,
    // data: {
    //     accessToken: result?.accessToken,
    //     needPasswordChange: result?.needPasswordChange
    // },
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {

  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Check your email!",
});
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {

  const token = req.headers.authorization || "";

  await AuthService.resetPassword(token, req.body);

  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Account recovered!",
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword
};
