import { teacherInstituteController } from "../../../controllers/institute/teacher/teacher.controller";

import { Router } from "express";

const teacherInstRouter = Router();

teacherInstRouter.route("/").post(teacherInstituteController);

export{teacherInstRouter}
