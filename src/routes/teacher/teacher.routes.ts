import { Router } from "express";
import { teacherController } from "../../controllers/teacher/teacher.controller";


const teacherRouter = Router();
teacherRouter.route("/login").post(teacherController)

export {teacherRouter}