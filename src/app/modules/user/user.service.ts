import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploaders } from "../../../helpers/fileUploaders";
import { prisma } from "../../../helpers/prisma";
import { TFile } from "../../interfaces/file";

const createAdmin = async (req: any) => {

  const file : TFile = req.file;
  // console.log(req.body);

  if(file){
    const uploadToCloudinari = await fileUploaders.uploadToCloudinari(file)
    // console.log(uploadToCloudinari);
    req.body.admin.profilePhoto = uploadToCloudinari?.secure_url
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createUserData = await transactionClient.user.create({
      data: userData,
    });

    const createAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createAdminData;
  });

  return result;
};

export const userServices = {
  createAdmin,
};
