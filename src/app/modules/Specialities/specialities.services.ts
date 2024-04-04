import { Request } from "express";
import { prisma } from "../../../helpers/prisma";
import { TFile } from "../../interfaces/file";
import { fileUploaders } from "../../../helpers/fileUploaders";
import { Specialities } from "@prisma/client";

const insertIntoDb = async (req: Request) => {
  const file = req.file as TFile;
  if(file){
    const uploadedProfileImage = await fileUploaders.uploadToCloudinari(file);
    req.body.icon = uploadedProfileImage?.secure_url;
  }
  const result = await prisma.specialities.create({
    data: req.body,
  });

  return result;
};


const getAllFromDB = async () => {
  return await prisma.specialities.findMany();
}

const deleteFromDB = async (id: string): Promise<Specialities> => {
  const result = await prisma.specialities.delete({
    where: {
      id,
    },
  });
  return result;
};

export const specialitiesService = {
  insertIntoDb,
  getAllFromDB,
  deleteFromDB
};
