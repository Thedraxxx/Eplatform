import { Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import { IExtedREquest } from "../../../utils/types";
import { categoryValidation } from "../../../database/validation/instCategory/category.validation";
import sequelize from "../../../database/connection";
import ApiResponse from "../../../utils/ApiResponse";


const insertCategory = asyncHandler(async(req: IExtedREquest, res: Response)=>{
        const instituteNumber = req.user?.currentInstituteNumber;
      const validData =  categoryValidation.parse(req.body);

      await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName,categoryDescription) VALUES (?,?)`,{
        replacements:[
            validData.categoryName,validData.categoryDescription
        ]
      });
return res.status(200).json(new ApiResponse(200,"category Inserted Successfully"))
       
});
export {insertCategory};

