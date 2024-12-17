const {z} = require('zod');

export const signupSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});