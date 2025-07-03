import z from "zod";

const categoryValidation = z.object({
  categoryName: z.string().nonempty(),
  categoryDescription: z.string().optional(),
});

const updateValidation = categoryValidation.partial();
export type IUpdateCategory = z.infer<typeof updateValidation>;
export type ICategory = z.infer<typeof categoryValidation>;
export { categoryValidation,updateValidation };
