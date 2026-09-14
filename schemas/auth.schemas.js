import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Required").email("Invalid email address"),
  password: z.string().min(1, "Required"),
});

export const registerSchema = z
  .object({
    username: z.string().trim().min(1, "Required"),
    email: z.string().trim().min(1, "Required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
