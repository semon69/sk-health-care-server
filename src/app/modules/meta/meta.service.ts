import { PaymentStatus, UserRole } from "@prisma/client";
import { TAuthUser } from "../../interfaces/common";
import { prisma } from "../../../helpers/prisma";

const fetchDashboardMetadata = async (user: any) => {
  let metadata;
  switch (user.role) {
    case UserRole.ADMIN:
      metadata = await getAdminDashboardMetadata();
      break;
    case UserRole.SUPER_ADMIN:
      metadata = await getSuperAdminDashboardMetadata();
      break;
    case UserRole.DOCTOR:
      metadata = await getDoctorDashboardMetadata(user);
      break;
    case UserRole.PATIENT:
      metadata = await getPatientDashboardMetadata(user);
      break;
    default:
      throw new Error("Invalid user role");
  }

  return metadata;
};

const getAdminDashboardMetadata = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
  };
};

const getSuperAdminDashboardMetadata = async () => {
  const appointmentCount = await prisma.appointment.count();
  const adminCount = await prisma.admin.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  return {
    appointmentCount,
    adminCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
  };
};

const getDoctorDashboardMetadata = async (user: TAuthUser) => {
  const doctorInfo = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });

  const appointmentData = await prisma.appointment.count({
    where: {
      doctorId: doctorInfo?.id,
    },
  });

  const patientData = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });
  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorInfo?.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorInfo?.id,
      },
      status: PaymentStatus.PAID,
    },
  });

  const appointmentStatusDestribuition = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorInfo?.id,
    },
  });

  const formatedAppointmentStatus = appointmentStatusDestribuition.map(
    (count) => ({
      status: count.status,
      count: count._count.id,
    })
  );

  return {
    appointmentData,
    patientData: patientData.length,
    reviewCount,
    totalRevenue: totalRevenue._sum,
    formatedAppointmentStatus,
  };
};

const getPatientDashboardMetadata = async (user: TAuthUser) => {
  const patientInfo = await prisma.patient.findUnique({
    where: {
      email: user?.email,
    },
  });

  const appointmentData = await prisma.appointment.count({
    where: {
      patientId: patientInfo?.id,
    },
  });

  const prescriptionData = await prisma.prescription.count({
    where: {
      patientId: patientInfo?.id,
    },
  });
  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientInfo?.id,
    },
  });

  const appointmentStatusDestribuition = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patientInfo?.id,
    },
  });

  const formatedAppointmentStatus = appointmentStatusDestribuition.map(
    (count) => ({
      status: count.status,
      count: count._count.id,
    })
  );

  return {
    patientInfo,
    appointmentData,
    prescriptionData,
    reviewCount,
    formatedAppointmentStatus,
  };
};

const getBarChartData = async () => {};

const getPieChartData = async () => {};

export const metaServices = {
  fetchDashboardMetadata,
};
