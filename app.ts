import express from "express";
import userRouter from "./src/routes/globals/auth/auth.route";
import errorHandler from "./src/middleware/errorHandler";
import instituteRouter from "./src/routes/institute/Institute.route";
import { teacherInstRouter } from "./src/routes/institute/teacher/teacher.routes";
const app = express();

app.use(express.json({limit: "1mb"})) // yo chi meddileware ho jasla frontend bata ako data lai limit ma rakhxa DDos attack bata bachauxa..
//INSTITUTE ROUTE
app.use("/api/v2/users",userRouter);
app.use("/api/v2/institute",instituteRouter)
app.use("/api/v2/teacher",teacherInstRouter);


app.use(errorHandler)
export default app;