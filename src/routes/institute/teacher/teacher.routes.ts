import { getAllTeacherInInstitute, teacherInstituteCreateController } from "../../../controllers/institute/teacher/instTeacher.controller";

import { Router } from "express";
import isLoggedIn from "../../../middleware/isLoggedin";
import upload from "../../../middleware/multer.middleware";
const teacherInstRouter = Router();

teacherInstRouter.route("/teacher").post(isLoggedIn,upload.single("teacherPhoto"),teacherInstituteCreateController);
teacherInstRouter.route("/getTeachers").get(isLoggedIn,getAllTeacherInInstitute);
export{teacherInstRouter}
