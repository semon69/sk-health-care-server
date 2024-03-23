import { Admin, Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../../helpers/prisma";
import { adminSearchableFields } from "./admin.constant";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { TAdminFilterRequest } from "./admin.interfaces";
import { TPaginationOptions } from "../../interfaces/pagination";

const getAllAdminFromDb = async (params: TAdminFilterRequest, options: TPaginationOptions) => {
  //   console.log({ params });
  const { searchTerm, ...filterData } = params;

  //   console.log(searchTerm);

  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

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
  // console.log(andConditions);

  const filterDataArray = Object.keys(filterData);

  if (filterDataArray.length > 0) {
    andConditions.push({
      AND: filterDataArray.map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  // console.dir(whereConditions, { depth: Infinity });

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
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateDataIntoDB = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });

  return result;
};

const deleteDataFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const deleteAdmin = await transactionClient.admin.delete({
      where: { id },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteAdmin.email,
      },
    });
    return deleteAdmin;
  });
  return result;
};

const softDeleteDataFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const deleteAdmin = await transactionClient.admin.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deleteAdmin;
  });
  return result;
};

export const adminService = {
  getAllAdminFromDb,
  getByIdFromDB,
  updateDataIntoDB,
  deleteDataFromDB,
  softDeleteDataFromDB,
};
