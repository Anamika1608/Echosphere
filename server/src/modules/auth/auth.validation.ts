import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    role: z.enum(['PG_OWNER', 'RESIDENT'], {
      required_error: 'Role is required',
      invalid_type_error: 'Invalid Role. Must be either PG_OWNER or RESIDENT',
    }),
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    profilePicture: z.string().optional(),
    pgCode: z.string().optional(),
  }).refine((data) => {
    // If role is RESIDENT, pgCode is required
    if (data.role === 'RESIDENT' && !data.pgCode) {
      return false;
    }
    // If role is PG_OWNER, pgCode should not be provided
    if (data.role === 'PG_OWNER' && data.pgCode) {
      return false;
    }
    return true;
  }, {
    message: "PG Code is required for residents and should not be provided for PG owners",
    path: ["pgCode"],
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string(),
  }),
});