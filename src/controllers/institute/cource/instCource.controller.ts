import { Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import { IExtedREquest } from "../../../utils/types";
import ApiError from "../../../utils/APIerror";
import uploadOnCloudnary from "../../../utils/cloudnary";
import { instCourseValidation,instUpdatedCourseValidation, IUpdateCourse } from "../../../database/validation/institute/InstituteCourse/course.validation";
import sequelize from "../../../database/connection";
import ApiResponse from "../../../utils/ApiResponse";
import { QueryTypes } from "sequelize";
import { idValidation } from "../../../database/validation/global/id.validation";


const insertCourse = asyncHandler(async(req: IExtedREquest, res: Response)=>{
             const thumbnail = req.file;
             if(!thumbnail){
                 throw new ApiError(401,"course Thumbnail is required!");
             }
             //cloud ma halyum ra url ra public id payum..
             const loacalFilePath = thumbnail.path;
            const thumbnailData =await uploadOnCloudnary(loacalFilePath);

            req.body.courseThumbnail = thumbnailData?.secure_url;
            const instituteNumber = req.user?.currentInstituteNumber
            //zod validation..
                const validCourseData =   instCourseValidation.parse(req.body);
            //logic here..
             await sequelize.query(`INSERT INTO course_${instituteNumber}(courseName,coursePrice,courseDiscription,courseDuration,courseLevel,courseThumbnail,courseSyllabus,categoryId) VALUES (?,?,?,?,?,?,?,?)`,{
                replacements: [
                    validCourseData.courseName,validCourseData.coursePrice,validCourseData.courseDiscription,validCourseData.courseDuration,validCourseData.courseLevel,validCourseData.courseThumbnail,validCourseData.courseSyllabus,validCourseData.categoryId
                ]
             });
             return res.status(200).json(new ApiResponse(201,"Course inserted successfully."))
});
const getCourse = asyncHandler(async(req: IExtedREquest,res: Response)=>{
    const instituteNumber = req.user?.currentInstituteNumber;
   const courses = await sequelize.query(`SELECT * FROM course_${instituteNumber} JOIN category_${instituteNumber} WHERE course_${instituteNumber}.categoryId = category_${instituteNumber}.id `,{
        type: QueryTypes.SELECT
    });

    if(courses.length === 0)
    {
        throw new ApiError(400,"No courses found!");
    } 
    return res.status(200).json(new ApiResponse(200,courses,"Courses Fetched successfully."));
})
const getSingleCourse = asyncHandler(async(req: IExtedREquest, res: Response)=>{
      const courseId = req.params.id;
      const instituteNumber = req.user?.currentInstituteNumber
      const course = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id=?`,{
        type: QueryTypes.SELECT,
        replacements: [courseId]
      });
       if(course.length === 0)
    {
        throw new ApiError(400,"No course found!");
    }
    return res.status(200).json(new ApiResponse(200,course,"Courses Fetched successfully."));
});
const deleteCourse = asyncHandler(async(req: IExtedREquest,res: Response)=>{
     const courseId = idValidation.parse(req.params.id);
     const instituteNumber = req.user?.currentInstituteNumber;
     const course = await sequelize.query(`DELETE FROM course_${instituteNumber} WHERE id=?`,{
        type: QueryTypes.DELETE,
        replacements: [courseId]
     });
    return res.status(200).json(new ApiResponse(200,course,"course successfully deleted."))
});
const updateCourse = asyncHandler(async(req: IExtedREquest,res: Response)=>{
    // console.log(req.params.id)
      const courseId = idValidation.parse(req.params.id);
    //    console.log(req.body)
      const validData= instUpdatedCourseValidation.parse(req.body);
    //   console.log(validData)
       const instituteNumber = req.user?.currentInstituteNumber;
      if(!validData || Object.keys(validData).length === 0){
        throw new ApiError(400,"At least one field is requred")
      } 

     const course=  await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id=?`,{
        type: QueryTypes.SELECT,
        replacements: [courseId]
      });
      if(course.length ===0 || !course){
        throw new ApiError(404,"course not found")
      }
     //dynamic UPDATE queies
      const updateFields: String[] = [];
      const replacements: any[] =[];
       Object.entries(validData).forEach(([key,value])=>{
           updateFields.push(`${key}=?`);
           replacements.push(value)
       });
      //for the where 
       replacements.push(courseId);

      const updatedCourse = await sequelize.query(`UPDATE course_${instituteNumber} SET ${updateFields.join(', ')} WHERE id=?`,{
        type: QueryTypes.UPDATE,
        replacements,
      })

      return res.status(200).json(new ApiResponse(200,updatedCourse,"course Updated successfully"))

});

export {insertCourse, getCourse, getSingleCourse, deleteCourse, updateCourse};