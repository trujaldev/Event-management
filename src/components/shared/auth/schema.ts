import z from "zod";

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must not exceed 32 characters")
    .regex(/^\S*$/, "Password must not contain spaces")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")

export const loginFormSchema = z.object({
    email: z.email({ message: "Invalid email format" }),
    password: passwordSchema
})

export const signUpFormSchema = loginFormSchema.extend({
    user_name: z.string().min(2, { message: "User name must be at least 2 characters" }),
    confirm_password: passwordSchema
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});