import { z } from "zod";

const instCourseValidation = z.object({
  courseName: z.string().min(1, "Course name is required"),
  coursePrice: z.coerce.string().min(1, "Course price is required"), // coercing number to string
  courseDiscription: z.string().nonempty(),
  courseDuration: z.string().min(1, "Course duration is required"),
  courseLevel: z.enum(['beginner', 'intermediate', 'advance']),
  courseThumbnail: z.string().url("Thumbnail must be a valid URL"), // assuming it's a URL
  courseSyllabus: z.string().optional(), // nullable field in DB
//   teacherId: z.string().uuid("Invalid teacher ID format"), // UUID format (VARCHAR(36))
});

export type IInstCourse = z.infer<typeof instCourseValidation> ;

export {instCourseValidation}
