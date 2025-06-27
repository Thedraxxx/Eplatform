import { Router } from "express";
import isLoggedIn from "../../../middleware/isLoggedin";
import { insertCategory,getAllCategory } from "../../../controllers/institute/category/category.controller";

export const instCategoryRouter = Router();

instCategoryRouter.route("/category/create").post(isLoggedIn,insertCategory);
instCategoryRouter.route("/category/getCategories").get(isLoggedIn,getAllCategory);

