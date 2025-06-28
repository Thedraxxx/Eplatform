import { Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import { IExtedREquest } from "../../../utils/types";
import ApiError from "../../../utils/APIerror";
import uploadOnCloudnary from "../../../utils/cloudnary";
import { instCourseValidation } from "../../../database/validation/InstituteCourse/course.validation";
import sequelize from "../../../database/connection";
import ApiResponse from "../../../utils/ApiResponse";


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
             await sequelize.query(`INSERT INTO course_${instituteNumber}(courseName,coursePrice,courseDiscription,courseDuration,courseLevel,courseThumbnail,courseSyllabus) VALUES (?,?,?,?,?,?,?)`,{
                replacements: [
                    validCourseData.courseName,validCourseData.coursePrice,validCourseData.courseDiscription,validCourseData.courseDuration,validCourseData.courseLevel,validCourseData.courseThumbnail,validCourseData.courseSyllabus
                ]
             });
             return res.status(200).json(new ApiResponse(201,"Course inserted successfully."))
});
const getCOurse = asyncHandler(async()=>{

})

export {insertCourse, getCOurse};