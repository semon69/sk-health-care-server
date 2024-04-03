import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { doctorController } from "./doctor.controller";

const router = express.Router();

router.get('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), doctorController.getAllFromDB)

router.get('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR), doctorController.getByIdFromDB)

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
);

// //task 5
// router.delete(
//   "/:id",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   DoctorController.deleteFromDB
// );

// // task 6
// router.delete(
//   "/soft/:id",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   DoctorController.softDelete
// );

export const DoctorRoutes = router;
