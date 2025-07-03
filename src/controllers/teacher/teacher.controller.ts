import { Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IExtedREquest } from "../../utils/types";
import { teacherValidation } from "../../database/validation/teacher/login";
import sequelize from "../../database/connection";
import ApiError from "../../utils/APIerror";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt"
import ApiResponse from "../../utils/ApiResponse";
import generateToken from "../../utils/generateToken";
interface ITeacehr {
    teacherPassword: string
    id: string
    password: string
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
      const teacherData: ITeacehr[]  = await sequelize.query(`SELECT id, teacherEmail, teacherPassword FROM teacher_${instituteNumber} WHERE teacherEmail=?`,{
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
    
    const token = await generateToken({id: teacherData[0].id, instituteNumber: validTeacherData.instituteNumber})

     return res.json(new ApiResponse(200,"Welcome to dashboard sir"));

});

export {teacherController}