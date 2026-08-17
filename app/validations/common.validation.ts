import * as z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

// Base RegEx patterns
export const NAME_REGEX = /^[a-zA-Z\s\-']*$/;

// Common validation primitives
export const commonRules = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters")
    .refine(
      (val) => NAME_REGEX.test(val),
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
};
