import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelperrs";
import { prisma } from "../../../helpers/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    "abcdefg",
    "5m"
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    "abcdefghijk",
    "30d"
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
    decodedData = jwtHelpers.verifyToken(token,"abcdefghijk" )

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
    "abcdefg",
    "5m"
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
