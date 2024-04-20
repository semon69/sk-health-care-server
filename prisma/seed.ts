import { UserRole } from "@prisma/client";
import { prisma } from "../src/helpers/prisma";
import ApiError from "../src/app/errors/ApiError";
import httpStatus from "http-status";
import bcrypt from 'bcrypt'

const createSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isSuperAdminExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, "ALready super admin exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("superadmin", 12);

    const superAdminData = await prisma.user.create({
      data: {
        email: "superadmin@gmail.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "01817855902",
          },
        },
      },
    });

    console.log("Super Admin created successfully", superAdminData);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

createSuperAdmin();
