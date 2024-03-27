import { z } from "zod";

const createAdmin = z.object({
  password: z.string({ required_error: "password is reuired" }),
  admin: z.object({
    name: z.string({ required_error: "name is requires" }),
    email: z.string({ required_error: "email is requires" }),
    contactNumber: z.string({ required_error: "contact number is requires" }),
  }),
});


export const userValidation = {
    createAdmin
}