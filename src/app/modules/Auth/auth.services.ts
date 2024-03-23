import { jwtHelpers } from "../../../helpers/jwtHelperrs";
import { prisma } from "../../../helpers/prisma";
import bcrypt from "bcrypt";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
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

export const AuthService = {
  loginUser,
};
