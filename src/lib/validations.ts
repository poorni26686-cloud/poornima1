/**
 * Shared zod validation schemas
 *
 * Centralized input validation for forms across the app. Phone numbers
 * accept international (E.164-style) and common local formats.
 */

import { z } from "zod";

// E.164 with optional separators: +<country><digits>, 7–15 digits total.
// Allows spaces, dashes, parentheses for readability — stripped for length check.
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export const phoneSchema = z
  .string()
  .trim()
  .refine((val) => val === "" || phoneRegex.test(val), {
    message: "Invalid phone number format",
  })
  .refine(
    (val) => {
      if (val === "") return true;
      const digits = val.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    },
    { message: "Phone number must be between 7 and 15 digits" }
  );

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email address")
  .max(255, "Email must be less than 255 characters");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be less than 72 characters");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[\p{L}\s'.-]+$/u, "Name contains invalid characters");

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  full_name: nameSchema.or(z.literal("")),
  phone: phoneSchema,
  avatar_url: z
    .string()
    .trim()
    .max(2048, "URL is too long")
    .url("Invalid URL")
    .or(z.literal("")),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
