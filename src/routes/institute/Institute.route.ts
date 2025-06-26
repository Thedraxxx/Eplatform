import instituteController from "../../controllers/institute/institute.controller";
import asyncHandler from "../../utils/asyncHandler";
import { Router } from "express";
import isLoggedIn from "../../middleware/isLoggedin";
const instituteRouter = Router();

instituteRouter.route("/createInstitute").post(isLoggedIn,asyncHandler(instituteController.createInstitute),asyncHandler(instituteController.createTeacherTable),asyncHandler(instituteController.createStudentTable),asyncHandler(instituteController.createCourseTable));

export default instituteRouter;
