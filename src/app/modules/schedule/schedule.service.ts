import { Schedule } from "@prisma/client";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TAuthUser } from "../../interfaces/common";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { prisma } from "../../../helpers/prisma";
import { addHours, addMinutes, format } from "date-fns";
import { TSchedule } from "./schedule.interface";

// const convertDateTime = async (date: Date) => {
//   const offset = date.getTimezoneOffset() * 60000;
//   return new Date(date.getTime() + offset);
// };

const insertIntoDB = async (payload: TSchedule): Promise<Schedule[]>  => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interverlTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate); // start date
  const lastDate = new Date(endDate); // end date

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      //   const s = await convertDateTime(startDateTime);
      //   const e = await convertDateTime(addMinutes(startDateTime, interverlTime));

      //   const scheduleData = {
      //     startDate: s,
      //     endDate: e,
      //   };
      const scheduleData = {
        startDate: startDateTime,
        endDate: addMinutes(startDateTime, interverlTime),
      };

      console.log(scheduleData);

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDate: scheduleData.startDate,
          endDate: scheduleData.endDate,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

// const getAllFromDB = async (
//   filters: IScheduleFilterRequest,
//   options: IPaginationOptions,
// ): Promise<IGenericResponse<Schedule[]>> => {
//   const { limit, page, skip } = paginationHelpers.calculatePagination(options);
//   const { ...filterData } = filters;

//   const andConditions = [];

//   // if (searchTerm) {
//   //   andConditions.push({
//   //     OR: patientSearchableFields.map(field => ({
//   //       [field]: {
//   //         contains: searchTerm,
//   //         mode: 'insensitive',
//   //       },
//   //     })),
//   //   });
//   // }

//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map(key => {
//         return {
//           [key]: {
//             equals: (filterData as any)[key],
//           },
//         };
//       }),
//     });
//   }

//   const whereConditions: Prisma.ScheduleWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   const result = await prisma.schedule.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? { [options.sortBy]: options.sortOrder }
//         : {
//           createdAt: 'desc',
//         },
//   });
//   const total = await prisma.schedule.count({
//     where: whereConditions,
//   });

//   return {
//     meta: {
//       total,
//       page,
//       limit,
//     },
//     data: result,
//   };
// };

const getAllFromDB = async (
  filters: any,
  options: TPaginationOptions,
  user: TAuthUser
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters; // Extracting startDate and endDate from filters

  const andConditions = [];

  // Adding date filtering conditions if startDate and endDate are provided
  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDate: {
            gte: startDate, // Greater than or equal to startDate
          },
        },
        {
          endDate: {
            lte: endDate, // Less than or equal to endDate
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
};

const getByIdFromDB = async (id: string): Promise<Schedule | null> => {
  const result = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Schedule> => {
  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ScheduleService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
};