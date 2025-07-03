import z from "zod";

const teacherValidation = z.object({
    instituteNumber: z.coerce.string().nonempty("institutte Number is required"),
    email: z.string().nonempty("Email is required").email("Invalid email format");
    password: z.string().nonempty("Not empty")
})

 export type ITeacher = z.infer<typeof teacherValidation>

 export{teacherValidation}