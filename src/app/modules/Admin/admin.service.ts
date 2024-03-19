import { Prisma } from "@prisma/client";
import { prisma } from "../../../helpers/prisma";

const getAllAdminFromDb = async (params: any) => {
  console.log({ params });

  const andConditions: Prisma.AdminWhereInput[] = [];
  const adminSearchableField = ["name", "email"];
  //   [
  //     {
  //       name: {
  //         contains: params.searchTerm,
  //         mode: "insensitive",
  //       },
  //     },
  //     {
  //       email: {
  //         contains: params.searchTerm,
  //         mode: "insensitive",
  //       },
  //     },
  //   ],
  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchableField.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  //   console.dir(whereConditions, { depth: Infinity });

  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};

export const adminService = {
  getAllAdminFromDb,
};
