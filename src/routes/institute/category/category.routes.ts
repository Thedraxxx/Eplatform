import { Router } from "express";
import isLoggedIn from "../../../middleware/isLoggedin";
import { insertCategory,getAllCategory,getSingleCategory, deleteCategory, updateCategory } from "../../../controllers/institute/category/category.controller";

export const instCategoryRouter = Router();

instCategoryRouter.route("/category/create").post(isLoggedIn,insertCategory);
instCategoryRouter.route("/category/getCategories").get(isLoggedIn,getAllCategory);
instCategoryRouter.route("/category/:slug").get(isLoggedIn,getSingleCategory);
instCategoryRouter.route("/category/update/:slug").patch(isLoggedIn,updateCategory);
instCategoryRouter.route("/category/delete/:id").delete(isLoggedIn,deleteCategory);

