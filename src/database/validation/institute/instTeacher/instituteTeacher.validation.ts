import { z } from "zod";

const instituteTeacherValidate = z.object({
  teacherName: z
    .string()
    .nonempty({ message: "Teacher name is required" })
    .min(2, { message: "Not less than 2 letters" })
    .max(20, { message: "Not more than 20 letters" }),

  teacherPhoneNumber: z
    .string()
    .nonempty({ message: "Phone number is required" }),
    // .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),

  teacherEmail: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Email is not valid" }),

  teacherSalary: z
    .string()
    .nonempty({ message: "Salary is required" })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Salary must be a valid number greater than 0",
    }),

  joinedDate: z
    .string()
    .nonempty({ message: "Joining date is required" }),
    // .refine((date) => !isNaN(Date.parse(date)), {
    //   message: "Invalid date format",
    // }),
    teacherPhoto: z.object({
        secure_url: z.string().nonempty().url("Invalid Image url"),
        public_id: z.string().nonempty()
    }),
    courseId: z.string().uuid("invaldi course id")
   
});

export type IInstTeacher = z.infer<typeof instituteTeacherValidate>
export{ instituteTeacherValidate}