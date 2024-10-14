import { z } from 'zod'

const signUpSchema = z.object({
    identifier: z.string().email("Invalid email").nonempty("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters").nonempty("Password is required"),
});