import express from "express";
import userRouter from "./src/routes/globals/auth/auth.route";
import errorHandler from "./src/middleware/errorHandler";
import instituteRouter from "./src/routes/institute/Institute.route";
import { teacherInstRouter } from "./src/routes/institute/teacher/teacher.routes";
import instCourseRouter from "./src/routes/institute/course/create.routes";
import { instCategoryRouter } from "./src/routes/institute/category/category.routes";
import { teacherRouter } from "./src/routes/teacher/teacher.routes";
import cors from "cors"
const app = express();

app.use(cors({
    origin: "*"
}))
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

app.use(express.json({limit: "1mb"})) // yo chi meddileware ho jasla frontend bata ako data lai limit ma rakhxa DDos attack bata bachauxa..
//INSTITUTE ROUTE
app.use("/api/v2/users",userRouter);
app.use("/api/v2/institute",instituteRouter)
app.use("/api/v2/institute",teacherInstRouter);
app.use("/api/v2/institute",instCourseRouter);
app.use("/api/v2/institute",instCategoryRouter);

//TEACHER ROUTE
app.use("/api/v2/teacher",teacherRouter);

app.use(errorHandler)
export default app;