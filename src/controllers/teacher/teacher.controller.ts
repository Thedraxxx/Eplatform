import { Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IExtedREquest } from "../../utils/types";
import { ITeacher, teacherValidation } from "../../database/validation/teacher/login";
import sequelize from "../../database/connection";
import ApiError from "../../utils/APIerror";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt"
import ApiResponse from "../../utils/ApiResponse";
interface ITeacehr {
    teacherPassword: string
    teacherid: string
}

const teacherController= asyncHandler(async(req:IExtedREquest,res:Response)=>{
      //format validation
      const validTeacherData = teacherValidation.parse(req.body);
      //db level validation....
      const instituteNumber = req.user?.currentInstituteNumber;
      if(instituteNumber!==validTeacherData.instituteNumber){
        throw new ApiError(401,"Unauthorized instittue number");
      }
      //email check ...
      const teacherData: ITeacher[] = await sequelize.query(`SELECT teacherEmail, teacherPassword FROM teacher_${instituteNumber} WHERE teacherEmail=?`,{
        type: QueryTypes.SELECT,
        replacements: [validTeacherData.email]
      })
     if(teacherData.length===0){
        throw new ApiError(401,"Invalid credentials")
     }
     // pass check ...
    const isMatched= bcrypt.compareSync(validTeacherData.password,teacherData[0].password);
    if(!isMatched){
        throw new ApiError(400,"password doesnt match")
    }
    const data = {
        teacherData[0].
    }
    generateToken()

     return res.json(new ApiResponse(200,"Welcome to dashboard sir"));

});

export {teacherController}