import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelperrs";
import { prisma } from "../../../helpers/prisma";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
      status:UserStatus.ACTIVE
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
    decodedData = jwtHelpers.verifyToken(token,config.jwt.refresh_secret as Secret )

    // decodedData = jwt.verify(token, "abcdefghijk");
  } catch (error) {
    throw new Error("Unauthorized access");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status:UserStatus.ACTIVE
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

export const AuthService = {
  loginUser,
  refreshToken,
};
