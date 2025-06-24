import z from "zod";

const registerValidation = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(15, { message: "Username must be at most 15 characters" }),

  email: z
    .string()
    .email({ message: "Please enter a valid email" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),

  // This will be optional at registration time, but available when updating
  currentInstituteNumber: z
    .string()
    .optional()
});
  export type IRegister = z.infer<typeof registerValidation>;
export {registerValidation}