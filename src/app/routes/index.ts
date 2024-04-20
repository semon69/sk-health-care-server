import express from "express";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { SpecialitiesRoutes } from "../modules/Specialities/specialities.routes";
import { DoctorRoutes } from "../modules/Doctor/doctor.routes";
import { PatientRoutes } from "../modules/patient/patient.routes";
import { ScheduleRoutes } from "../modules/schedule/schedule.routes";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.routes";
import { AppointmentRoutes } from "../modules/appointment/appointment.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { PrescriptionsRoutes } from "../modules/prescription/prescription.routes";
import { ReviewRoutes } from "../modules/review/review.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/specialities",
    route: SpecialitiesRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/schedule",
    route: ScheduleRoutes,
  },
  {
    path: "/doctorSchedule",
    route: DoctorScheduleRoutes,
  },
  {
    path: "/appointment",
    route: AppointmentRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/prescription",
    route: PrescriptionsRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
