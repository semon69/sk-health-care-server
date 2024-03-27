import { Patient, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploaders } from "../../../helpers/fileUploaders";
import { prisma } from "../../../helpers/prisma";
import { TFile } from "../../interfaces/file";
import config from "../../config";
import { Request } from "express";

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

const createDoctor = async (req: Request) => {

  const file  = req.file as TFile
  if(file){
    const uploadToCloudinari = await fileUploaders.uploadToCloudinari(file)
    req.body.doctor.profilePhoto = uploadToCloudinari?.secure_url
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createUserData = await transactionClient.user.create({
      data: userData,
    });

    const createDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createDoctorData;
  });

  return result;
};

const createPatient = async (req: any) => {
  
  const file: TFile = req.file

  if (file) {
    const uploadedProfileImage = await fileUploaders.uploadToCloudinari(file);
    req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, 12);
  const result = await prisma.$transaction(async transactionClient => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
        role: UserRole.PATIENT,
      },
    });
    const newPatient = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return newPatient;
  });

  return result;
};

export const userServices = {
  createAdmin,
  createDoctor,
  createPatient
};
