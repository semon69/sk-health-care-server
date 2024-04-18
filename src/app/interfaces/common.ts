import { UserRole } from "@prisma/client";

export type TAuthUser = {
  email: string;
  role: UserRole;
} | null;

export type TGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};
