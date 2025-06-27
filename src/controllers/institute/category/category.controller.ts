import { response, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import { IExtedREquest } from "../../../utils/types";
import { categoryValidation } from "../../../database/validation/instCategory/category.validation";
import sequelize from "../../../database/connection";
import ApiResponse from "../../../utils/ApiResponse";
import { QueryTypes } from "sequelize";
import ApiError from "../../../utils/APIerror";
import slug from "../../../utils/slugify";


const insertCategory = asyncHandler(async(req: IExtedREquest, res: Response)=>{
        const instituteNumber = req.user?.currentInstituteNumber;
      const validData =  categoryValidation.parse(req.body);
      const categorySlug = slug(validData.categoryName);
      await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName,categorySlug,categoryDescription) VALUES (?,?,?)`,{
         type: QueryTypes.INSERT,
        replacements:[
            validData.categoryName,categorySlug,validData.categoryDescription
        ]
      });
return res.status(200).json(new ApiResponse(200,"category Inserted Successfully"))
});

const getAllCategory = asyncHandler(async(req: IExtedREquest,res: Response)=>{
    const instituteNumber = req.user?.currentInstituteNumber
    const categories=   await sequelize.query(`SELECT * FROM category_${instituteNumber}`,{
        type: QueryTypes.SELECT
      });
      return res.status(200).json(new ApiResponse(200,categories,"Caregories Fetched Successfully."))
});
const getSingleCategory = asyncHandler(async(req:IExtedREquest,res: Response)=>{
       const instituteNumber = req.user?.currentInstituteNumber;
       const categorySlug = req.params.slug;
       if(!categorySlug){
        throw new ApiError(400,"slug is required")
       }
        const category = await sequelize.query(`SELECT * FROM category_${instituteNumber} WHERE categorySlug=?`,{
            replacements: [categorySlug],
            type: QueryTypes.SELECT
        });
        if(!category){
            throw new ApiError(404,"Category not found")
        }
        return res.status(200).json(new ApiResponse(200,category,"Fethced successfully"));
});
export {insertCategory, getAllCategory, getSingleCategory};

