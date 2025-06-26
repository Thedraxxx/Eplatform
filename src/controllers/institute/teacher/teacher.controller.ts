import { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import ApiError from "../../../utils/APIerror";
import sequelize from "../../../database/connection";
import { IExtedREquest } from "../../../utils/types";
import { IInstTeacher, instituteTeacherValidate } from "../../../database/validation/instituteTeacher.validation";
import { Multer } from "multer";
import uploadOnCloudnary from "../../../utils/cloudnary";
const teacherInstituteController = asyncHandler(async(req: IExtedREquest,res: Response)=>{
       const teacherImage = req.file as Express.Multer.File;
       if(!teacherImage){
          throw new ApiError(401,"Image is required")
       }
       const imagePath = teacherImage.path;
      const imageData = await uploadOnCloudnary(imagePath);
      req.body.teacherImage = imageData;
    
      const validTeacherData: IInstTeacher = instituteTeacherValidate.parse(req.body);
       if(!validTeacherData){
          throw new ApiError(401,"zod error");
       }
       const instituteNumber =req.user?.currentInstituteNumber; 
       await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName, teacherPhoneNumber, teacherEmail,teacherPhoto, teacherSalary, joinedDate) VALUES (?,?,?,?,?,?) `,
          {     
               replacements: [validTeacherData.teacherName,validTeacherData.teacherPhoneNumber,validTeacherData.teacherEmail,validTeacherData.teacherImage.secure_url,validTeacherData.teacherSalary,validTeacherData.joinedDate]
          }
       )

       return res.json("teacher table created")
       

})

export {teacherInstituteController};