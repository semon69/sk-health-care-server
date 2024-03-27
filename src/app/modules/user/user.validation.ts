import { z } from "zod";

const createAdmin = z.object({
  password: z.string({ required_error: "password is reuired" }),
  admin: z.object({
    name: z.string({ required_error: "name is requires" }),
    email: z.string({ required_error: "email is requires" }),
    contactNumber: z.string({ required_error: "contact number is requires" }),
  }),
});

const createDoctor = z.object({
  password: z.string(),
  doctor: z.object({
    email: z.string().email(),
    name: z.string(),
    contactNumber: z.string(),
    address: z.string().nullable(),
    registrationNumber: z.string(),
    experience: z.number().int(),
    gender: z.enum(["MALE", "FEMALE"]),
    apointmentFee: z.number(),
    qualification: z.string(),
    currentWorkingPlace: z.string(),
    designation: z.string(),
  }),
});

export const userValidation = {
  createAdmin,
  createDoctor,
};
