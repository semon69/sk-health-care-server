import { Admin, Prisma } from "@prisma/client";
import { prisma } from "../../../helpers/prisma";
import { adminSearchableFields } from "./admin.constant";
import { calculatePagination } from "../../../helpers/paginationHelper";


const getAllAdminFromDb = async (params: any, options: any) => {
  //   console.log({ params });
  const { searchTerm, ...filterData } = params;

//   console.log(searchTerm);

  const {page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

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
  const total = await prisma.admin.count({
    where: whereConditions
  })

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  }
  ;
};

const getByIdFromDB = async(id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id
    }
  })
  
  const result = await prisma.admin.findUnique({
    where: {
      id
    }
  })
  return result
}

const updateDataIntoDB = async(id: string, data: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id
    }
  })

  const result = await prisma.admin.update({
    where: {
      id
    },
    data,
  })

  return result
}

export const adminService = {
  getAllAdminFromDb,
  getByIdFromDB,
  updateDataIntoDB
};
