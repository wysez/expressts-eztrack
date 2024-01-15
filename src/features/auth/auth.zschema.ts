import { z } from 'zod';

export const signinSchema = z.object({
  username: z.string().min(3, 'username must be at least 3 characters'),
  password: z.string().min(4, 'password must be at least 4 characters'),
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'username must be at least 3 characters')
    .max(10, 'username must be less than 10 characters'),
  email: z.string().email('must be a valid email'),
  password: z
    .string()
    .min(4, 'password must be at least 4 characters')
    .max(20, 'password must be less than 20 characters'),
  firstName: z
    .string()
    .min(1, 'first name is required')
    .max(20, 'first name must be less than 20 characters'),
  lastName: z
    .string()
    .min(1, 'last name is required')
    .max(20, 'last name must be less than 20 characters'),
  birthDate: z.string().min(1).max(20, 'birth date is not valid'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  zipCode: z
    .string()
    .min(5, 'zip code must be 5 characters')
    .max(5, 'zip code must be 5 characters'),
});
