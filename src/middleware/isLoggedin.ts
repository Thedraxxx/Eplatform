import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/APIerror";
import { envconfig } from "../config/config";
import User from "../database/models/user.model";
import { IExtedREquest } from "../utils/types";

  const isLoggedIn = asyncHandler(
    async (req: IExtedREquest, res: Response, next: NextFunction) => {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new ApiError(401, "Token not found");
      }
      const varifiedToken = jwt.verify(
        token,
        envconfig.accesstoken_secret as string
      ) as { id: number };
      if (!varifiedToken?.id) {
        throw new ApiError(401, "Token is invalid");
      }
      const userData = await User.findByPk(varifiedToken.id, {
        attributes: ["id", "currentInstituteNumber"],
      }); //only selected feild send

      if (!userData) {
        throw new ApiError(404, "User is not found");
      }
      req.user = userData;
      next();
    }
  );
export default isLoggedIn;
