/*
Register
login
logout
forget-password
reset-password
*/

//req ra res chai express ko type ho

import { Request, Response } from "express";
import ApiResponse from "../../../utils/ApiResponse";
import User from "../../../database/models/user.model";

class authController {
  async UserRegister(req: Request, res: Response) {
    const safeUserData = await User.register(req.body);
    console.log(safeUserData)
    return res
      .status(201) //used for the created things
      .json(
        new ApiResponse(
          201,
          safeUserData,
          "The user is successfully registered"
        )
      );
  }
  async UserLogin(req: Request, res: Response) {}
}

export default new authController();
