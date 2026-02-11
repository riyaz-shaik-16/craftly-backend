import { z } from "zod";

// Username rules (same everywhere)
const usernameRegex = /^[a-z0-9-]{3,20}$/;

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  
  email: z
    .string()
    .email("Invalid email address")
    .min(5)
    .max(255),

  username: z
    .string()
    .regex(
      usernameRegex,
      "Username must be 3-20 chars, lowercase, letters/numbers/hyphens only"
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
