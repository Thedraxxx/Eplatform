import { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import ApiError from "../../../utils/APIerror";
import sequelize from "../../../database/connection";
import { IExtedREquest } from "../../../utils/types";

const teacherInstituteController = asyncHandler(async(req: IExtedREquest,res: Response)=>{
      const { teacherName, teacherPhoneNumber, teacherEmail, teacherSalary, joindedDate} = req.body;
      const instituteNumber = req.user?.currentInstituteNumber
       if(!teacherName || !teacherEmail || !teacherPhoneNumber ||!teacherSalary || !joindedDate){
            throw new ApiError(401,"These feild are required.")
       }
       await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName, teacherPhoneNumber, teacherEmail, teacherSalary) `)
       

})

export {teacherInstituteController};