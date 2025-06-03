import { Router } from "express";
import authController from "../../../controllers/globals/auth/auth.controller";
import asyncHandler from "../../../utils/asyncHandler";
const userRouter = Router();


userRouter.route("/register").post(asyncHandler(authController.UserRegister)) // ya error ako theryo jun ma chi async handler user garara solve vo so ma tai file ma explain garxu

export default userRouter;