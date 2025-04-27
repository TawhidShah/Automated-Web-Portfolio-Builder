import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().trim().nonempty("First Name is required"),
  lastName: z.string().trim().nonempty("Last Name is required"),
  username: z
    .string()
    .trim()
    .min(4, "Username must be at least 4 characters")
    .max(64, "Username must be at most 64 characters"),
  emailAddress: z.string().nonempty("Email is required").email("Email is invalid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
