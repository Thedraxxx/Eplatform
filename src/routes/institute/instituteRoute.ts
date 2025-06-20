import instituteController from "../../controllers/institute/institute.controller";
import asyncHandler from "../../utils/asyncHandler";
import { Router } from "express";

const instituteRouter = Router();

instituteRouter.route("/createInstitute").post(asyncHandler(instituteController.createInstitute));

export default instituteRouter;
