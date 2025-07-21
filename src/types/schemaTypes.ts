import { loginFormSchema, signUpFormSchema } from "@/components/shared/auth/schema"
import z from "zod"

export type TLoginForm = z.infer<typeof loginFormSchema>
export type TSignUpForm = z.infer<typeof signUpFormSchema>
export type TUser = Omit<TSignUpForm, 'confirm_password'>
export type TAuthenticatedUser = Omit<TUser, 'password'>