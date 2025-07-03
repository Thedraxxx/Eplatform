import { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import ApiError from "../../../utils/APIerror";
import sequelize from "../../../database/connection";
import { IExtedREquest } from "../../../utils/types";
import { IInstTeacher, instituteTeacherValidate } from "../../../database/validation/instituteTeacher.validation";
import { Multer } from "multer";
import uploadOnCloudnary from "../../../utils/cloudnary";
import passwordGenerator from "../../../utils/password.generator";
import { QueryTypes } from "sequelize";
import sendEmail from "../../../utils/email.send";
const teacherInstituteController = asyncHandler(async(req: IExtedREquest,res: Response)=>{
     //image received
       const teacherImage = req.file as Express.Multer.File;
       if(!teacherImage){
          throw new ApiError(401,"Image is required")
       }
       //upload to cloud
       const imagePath = teacherImage.path;
      const imageData = await uploadOnCloudnary(imagePath);
      req.body.teacherPhoto = imageData;
      //zod validation
      const validTeacherData: IInstTeacher = instituteTeacherValidate.parse(req.body);
       if(!validTeacherData){
          throw new ApiError(401,"zod error");
       }
       //plain ra hash password aayo
       const passwordData = passwordGenerator(validTeacherData.teacherName);
       if(!passwordData){
         throw new ApiError(400,"faild to generate password")
       }
       //insertion query
       const instituteNumber =req.user?.currentInstituteNumber;
       //inserted datas 
       await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName, teacherPhoneNumber, teacherEmail,teacherPhoto, teacherSalary, joinedDate,teacherPassword,courseId) VALUES (?,?,?,?,?,?,?,?) `,
          {     type: QueryTypes.INSERT,
               replacements: [validTeacherData.teacherName,validTeacherData.teacherPhoneNumber,validTeacherData.teacherEmail,validTeacherData.teacherPhoto.secure_url,validTeacherData.teacherSalary,validTeacherData.joinedDate,passwordData.hashedPassword,validTeacherData.courseId]
          }
       )
      //  console.log(teacherData)
      //find the teacherId 
      // console.log(validTeacherData.teacherEmail)
      const teacherId: {id: string}[] = await sequelize.query(`SELECT id FROM teacher_${instituteNumber} WHERE teacherEmail=?`,{
         type: QueryTypes.SELECT,
         replacements: [validTeacherData.teacherEmail]
       })
       if(teacherId.length ===0){
         throw new ApiError(400,"id not found")
       } 
   
      //  console.log(teacherId)
       //update the course table 
         await sequelize.query(`UPDATE course_${instituteNumber} SET teacherId=? WHERE id=? `,{
            type: QueryTypes.UPDATE,
            replacements: [teacherId[0].id,validTeacherData.courseId]
         });
         //teacher lai mail pathaunu paryo with email and pass....
          const mailDetails ={
               to: validTeacherData.teacherEmail,
               subject: 'welcome to our institute',
               message: `Welcome xa hai sir... <b>Email</b>: ${validTeacherData.teacherEmail} | password: ${passwordData.planePassword} | Institute Number: ${instituteNumber}`
          }
         await sendEmail(mailDetails);
       return res.json("teacher table created")
       

})

export {teacherInstituteController};