/*
Register
login
logout
forget-password
reset-password
*/

import { Request, Response } from "express";
import ApiResponse from "../../../utils/ApiResponse";
import User from "../../../database/models/user.model";
import { registerValidation } from "../../../database/validation/global/user.validation";
class authController {
  async UserRegister(req: Request, res: Response) {
    const userDataValidate = registerValidation.parse(req.body);
    console.log(userDataValidate);
    const safeUserData = await User.register(userDataValidate); // model ma vako func provoke garxa..
    // console.log(safeUserData);
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          safeUserData,
          "The user is successfully registered"
        )
      );
  }
  async UserLogin(req: Request, res: Response) {
    const {safeUserData,accessToken,refreshToken,options} = await User.logIn(req.body);
    res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(new ApiResponse(200,safeUserData,"user loggedIn successfully"));
  }
}

export default new authController();
