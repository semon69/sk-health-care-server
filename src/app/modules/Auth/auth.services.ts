import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelperrs";
import { prisma } from "../../../helpers/prisma";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../config";
import { sendMailer } from "./sendEmail";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
      status: UserStatus.ACTIVE,
    },
  });
  //  console.log(payload);
  const isPasswordCorrect = await bcrypt.compare(
    payload?.password,
    userData?.password
  );
  //   console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new Error("Incorrect Password");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData?.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  // console.log('refresh token', token);
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );

    // decodedData = jwt.verify(token, "abcdefghijk");
  } catch (error) {
    throw new Error("Unauthorized access");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData?.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordCorrect = await bcrypt.compare(
    payload?.oldPassword,
    userData?.password
  );
  //   console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new Error("Incorrect Password");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

const forgotPassword = async (payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetToken = jwtHelpers.generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.reset_secret as Secret,
    config.jwt.reset_pass_expires_in as string
  );

  const resetLink =
    config.jwt.reset_pass_link + `?userId=${userData?.id}&&token=${resetToken}`;

  await sendMailer(
    userData?.email,
    `
  <div>
    <p>Dear ${userData.role},</p>
    <p>Your password reset link: <a href=${resetLink}><button>RESET PASSWORD<button/></a></p>
    <p>Thank you</p>
  </div>
`
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const isVarified = jwtHelpers.verifyToken(token, config.jwt.secret as string);

  if (!isVarified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Something went wrong!");
  }

  const password = await bcrypt.hash(
    payload.password,
    Number(config.bycrypt_salt_rounds)
  );

  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
