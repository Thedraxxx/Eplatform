import z from "zod"

export const idValidation = z.string().uuid("Invalid id type").nonempty("id should not be empty");