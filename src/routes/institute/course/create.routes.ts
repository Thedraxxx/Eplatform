
import { Router } from "express";
import isLoggedIn from "../../../middleware/isLoggedin";
import upload from "../../../middleware/multer.middleware";
import { insertCourse } from "../../../controllers/institute/cource/instCource.controller";

const instCourseRouter = Router();
   
instCourseRouter.route("/insert").post(isLoggedIn,upload.single("courseThumbnail"),insertCourse);
export  default instCourseRouter