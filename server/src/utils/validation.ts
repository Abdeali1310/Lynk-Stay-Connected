const { z } = require("zod");

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  bio: z.string().optional(),
  avatar: z.object({
    url: z.string().url({ message: "Invalid avatar URL" }),
    public_id: z.string().min(1, { message: "Avatar public ID is required" }),
  }),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must not exceed 20 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must not exceed 100 characters"),
});

export const adminLoginSchema = z.object({
  secretKey: z.string(),
});

export const newGroupValidator = z.object({
  name: z.string().nonempty("Name is required"),
  members: z
    .array(z.string())
    .min(2, "Members must be at least 2")
    .max(100, "Members must not exceed 100")
    .nonempty("Members are required"),
});
