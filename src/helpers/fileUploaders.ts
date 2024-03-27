import multer from "multer";
import path, { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";
import config from "../app/config";
import fs from "fs"
import { TCloudinariResponse, TFile } from "../app/interfaces/file";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinari = async (file: TFile): Promise<TCloudinariResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: TCloudinariResponse) => {
        fs.unlinkSync(file.path)
        if (error) {
          reject(error);
        } else {
          resolve(result)
        }
      }
    );
  });
};

export const fileUploaders = {
  upload,
  uploadToCloudinari,
};
