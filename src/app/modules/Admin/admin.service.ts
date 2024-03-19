import { Prisma } from "@prisma/client";
import { prisma } from "../../../helpers/prisma";
import { adminSearchableFields } from "./admin.constant";
import { calculatePagination } from "../../../helpers/paginationHelper";


const getAllAdminFromDb = async (params: any, options: any) => {
  //   console.log({ params });
  const { searchTerm, ...filterData } = params;

//   console.log(searchTerm);

  const { limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    // console.log(searchTerm);
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  console.log(andConditions);

  const filterDataArray = Object.keys(filterData);


  if (filterDataArray.length > 0) {
    andConditions.push({
      AND: filterDataArray.map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  //   console.log(filterDataArray);

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
    console.dir(whereConditions, { depth: Infinity });

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    // take: limit,
    // orderBy:
    //   sortBy && sortOrder
    //     ? {
    //         [sortBy]: sortOrder,
    //       }
    //     : {
    //         createdAt: "desc",
    //       },
  });
  return result;
};

export const adminService = {
  getAllAdminFromDb,
};
