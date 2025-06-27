import { response, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import { IExtedREquest } from "../../../utils/types";
import {
  categoryValidation,
  updateValidation,
} from "../../../database/validation/instCategory/category.validation";
import sequelize from "../../../database/connection";
import ApiResponse from "../../../utils/ApiResponse";
import { QueryTypes } from "sequelize";
import ApiError from "../../../utils/APIerror";
import slug from "../../../utils/slugify";

const insertCategory = asyncHandler(
  async (req: IExtedREquest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const validData = categoryValidation.parse(req.body);
    const categorySlug = slug(validData.categoryName);
    await sequelize.query(
      `INSERT INTO category_${instituteNumber}(categoryName,categorySlug,categoryDescription) VALUES (?,?,?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [
          validData.categoryName,
          categorySlug,
          validData.categoryDescription,
        ],
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, "category Inserted Successfully"));
  }
);

const getAllCategory = asyncHandler(
  async (req: IExtedREquest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const categories = await sequelize.query(
      `SELECT * FROM category_${instituteNumber}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, categories, "Caregories Fetched Successfully.")
      );
  }
);
const getSingleCategory = asyncHandler(
  async (req: IExtedREquest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const categorySlug = req.params.slug;
    if (!categorySlug) {
      throw new ApiError(400, "slug is required");
    }
    const category = await sequelize.query(
      `SELECT * FROM category_${instituteNumber} WHERE categorySlug=?`,
      {
        replacements: [categorySlug],
        type: QueryTypes.SELECT,
      }
    );
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, category, "Fethced successfully"));
  }
);
const updateCategory = asyncHandler(
  async (req: IExtedREquest, res: Response) => {
    //slug ra updated data aayo
    const categorySlug = req.params.slug;
    const validData = updateValidation.parse(req.body);
    const instituteNumber = req.user?.currentInstituteNumber;
    if (
      validData.categoryName === undefined &&
      validData.categoryDescription === undefined
    ) {
      throw new ApiError(400, "You must provide at least one field to update.");
    } 

    const slugify = validData.categoryName
      ? slug(validData.categoryName)
      : null;
      //find the category with slug
    const category = await sequelize.query(
      `SELECT * FROM category_${instituteNumber} WHERE categorySlug = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [categorySlug],
      }
    );
    if (category.length === 0) {
      throw new ApiError(404, "Category not found");
    }
    //dynamic filds for the update
    const uploadFeilds: string[] = [];
    const replacements: any = [];
    if (validData.categoryName) {
      uploadFeilds.push("categoryName= ?");
      replacements.push(validData.categoryName);

      uploadFeilds.push("categorySlug = ?");
      replacements.push(slugify);
    }
    if (validData.categoryDescription) {
      uploadFeilds.push("categoryDescription= ?");
      replacements.push(validData.categoryDescription);
    }
    replacements.push(categorySlug);
    //update query
    await sequelize.query(
      `UPDATE category_${instituteNumber} SET ${uploadFeilds.join(
        ", "
      )} WHERE categorySlug = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements,
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "category successully updated."));
  }
);
const deleteCategory = asyncHandler(
  async (req: IExtedREquest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const slug = req.params.slug;
    if (!slug) {
      throw new ApiError(400, "slug is required!");
    }
    const deletedCategory = await sequelize.query(
      `DELETE FROM category_${instituteNumber} WHERE categorySlug = ?`,
      {
        type: QueryTypes.DELETE,
        replacements: [slug],
      }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedCategory, "category deleted Successfully")
      );
  }
);
export {
  insertCategory,
  getAllCategory,
  updateCategory,
  getSingleCategory,
  deleteCategory,
};
