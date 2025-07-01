
import { Router } from "express";
import isLoggedIn from "../../../middleware/isLoggedin";
import upload from "../../../middleware/multer.middleware";
import { insertCourse, getCourse, getSingleCourse, deleteCourse, updateCourse  } from "../../../controllers/institute/cource/instCource.controller";

const instCourseRouter = Router();
   
instCourseRouter.route("/insert").post(isLoggedIn,upload.single("courseThumbnail"),insertCourse);
instCourseRouter.route("/get-courses").get(isLoggedIn,getCourse);
instCourseRouter.route("/courses/:id").get(isLoggedIn,getSingleCourse);
instCourseRouter.route("/course/delete/:id").delete(isLoggedIn,deleteCourse);
instCourseRouter.route("/course/update/:id").patch(isLoggedIn,updateCourse);
export  default instCourseRouter