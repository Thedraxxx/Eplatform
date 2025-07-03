import { teacherInstituteController } from "../../../controllers/institute/teacher/instTeacher.controller";

import { Router } from "express";
import isLoggedIn from "../../../middleware/isLoggedin";
import upload from "../../../middleware/multer.middleware";
const teacherInstRouter = Router();

teacherInstRouter.route("/teacher").post(isLoggedIn,upload.single("teacherPhoto"),teacherInstituteController);

export{teacherInstRouter}
