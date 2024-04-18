import { DoctorSchedule, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../../helpers/prisma";
import ApiError from "../../errors/ApiError";
import { TAuthUser, TGenericResponse } from "../../interfaces/common";
import { TScheduleFilterRequest } from "../schedule/schedule.interface";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IDoctorScheduleFilterRequest } from "./doctorSchedule.interface";

const insertIntoDB = async (
  data: { scheduleIds: string[] },
  user: TAuthUser
) => {
  const { scheduleIds } = data;

  const isDoctorExists = await prisma.doctor.findFirst({
    where: {
      email: user?.email,
    },
  });

  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor does not exists!");
  }
  //   return isDoctorExists

  const scheduleData = scheduleIds.map((scheduleId) => ({
    doctorId: isDoctorExists.id,
    scheduleId,
  }));

  const result = prisma.doctorSchedule.createMany({
    data: scheduleData,
  });

  return result;
};

const getAllFromDB = async (
  filters: IDoctorScheduleFilterRequest,
  options: TPaginationOptions,
): Promise<TGenericResponse<DoctorSchedule[]>> => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
      filterData.isBooked = true;
    } else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key]
        }
      }))
    });
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctorSchedule.findMany({
    include: {
      doctor: true,
      schedule: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
          createdAt: 'desc',
        },
  });
  const total = await prisma.doctorSchedule.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// const getByIdFromDB = async (id: string): Promise<DoctorSchedule | null> => {
//   const result = await prisma.doctorSchedule.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       doctor: true,
//       schedule: true,
//     },
//   });
//   return result;
// };

// const updateIntoDB = async (
//   id: string,
//   payload: Partial<DoctorSchedule>,
// ): Promise<DoctorSchedule | null> => {
//   const result = await prisma.doctorSchedule.update({
//     where: {
//       id,
//     },
//     data: payload,
//     include: {
//       doctor: true,
//       schedule: true,
//     },
//   });
//   return result;
// };

const deleteFromDB = async (
  user: TAuthUser,
  scheduleId: string
): Promise<DoctorSchedule> => {
  const isDoctorExists = await prisma.doctor.findFirst({
    where: {
      email: user?.email,
    },
  });

  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor does not exitsts");
  }


  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: isDoctorExists.id,
        scheduleId
      },
    },
  });
  return result;
};

const getMySchedules = async (
  filters: TScheduleFilterRequest,
  options: TPaginationOptions,
  user: any
): Promise<TGenericResponse<DoctorSchedule[]>> => {
  const { limit, page, skip } = calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    doctor: {
      email: user.email,
    },
    ...(startDate && endDate
      ? {
          schedule: {
            startDate: {
              gte: new Date(startDate),
            },
            endDate: {
              lte: new Date(endDate),
            },
          },
        }
      : {}),
    ...(Object.keys(filterData).length > 0
      ? {
          AND: Object.keys(filterData).map((key) => ({
            [key]: {
              equals: (filterData as any)[key],
            },
          })),
        }
      : {}),
  };

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    include: {
      doctor: true,
      schedule: true,
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    meta: {
      total: doctorSchedules.length,
      page,
      limit,
    },
    data: doctorSchedules,
  };
};

export const DoctorScheduleService = {
  insertIntoDB,
    getAllFromDB,
  // getByIdFromDB,
  // updateIntoDB,
  deleteFromDB,
  getMySchedules,
};
