import z from "zod";

const categoryValidation = z.object({
    categoryName: z.string().nonempty(),
    categoryDescription: z.string().optional()
});

export type ICategory = z.infer<typeof categoryValidation>
export {categoryValidation}