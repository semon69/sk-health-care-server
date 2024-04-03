import { Request } from "express";
import { prisma } from "../../../helpers/prisma";
import { TFile } from "../../interfaces/file";
import { fileUploaders } from "../../../helpers/fileUploaders";

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

export const specialitiesService = {
  insertIntoDb,
};
