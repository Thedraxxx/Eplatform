import { Router } from "express";
import isLoggedIn from "../../../middleware/isLoggedin";
import { insertCategory,getAllCategory,getSingleCategory, deleteCategory } from "../../../controllers/institute/category/category.controller";

export const instCategoryRouter = Router();

instCategoryRouter.route("/category/create").post(isLoggedIn,insertCategory);
instCategoryRouter.route("/category/getCategories").get(isLoggedIn,getAllCategory);
instCategoryRouter.route("/category/:slug").get(isLoggedIn,getSingleCategory);
instCategoryRouter.route("/category/delete/:slug").delete(isLoggedIn,deleteCategory);

