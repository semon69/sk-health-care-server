import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PrescriptionController } from "./prescription.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { PrescriptionValidation } from "./prescription.validation";

const router = express.Router();
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PrescriptionController.getAllFromDB
);

router.get("/:id", PrescriptionController.getByIdFromDB);

router.get(
  "/my-prescriptions",
  auth(UserRole.PATIENT),
  PrescriptionController.patientPrescriptions
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(PrescriptionValidation.create),
  PrescriptionController.insertIntoDB
);

export const PrescriptionsRoutes = router;
