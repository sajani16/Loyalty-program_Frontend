import * as z from "zod";
import { commonRules } from "./common.validation";

export const loginSchema = z.object({
  email: commonRules.email,
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Business name must be at least 3 characters")
      .max(100, "Business name must not exceed 100 characters"),
    email: commonRules.email,
    userType: z.string(),
    // googleReview: commonRules.googleReview,
    password: commonRules.password,
//     confirmPassword: z.string().min(1, "Please confirm your password"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: commonRules.email,
});

export const resetPasswordSchema = z
  .object({
    password: commonRules.password,
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyOtpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
