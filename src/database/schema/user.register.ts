import z from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(10)
    .nonempty({ message: "This feild should not be empty" }),

  email: z
    .string()
    .nonempty({ message: "yo field empty hunu vayana" })
    .email({ message: "Email format ma chiyo" }),
  password: z
    .string()
    .nonempty({ message: "empty hunu vayana password" })
    .min(5, { message: "5 vanda dharai halum hai" })
    .max(14),
});
