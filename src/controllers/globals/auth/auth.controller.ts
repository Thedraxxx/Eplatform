/*
Register
login
logout
forget-password
reset-password
*/

//req ra res chai express ko type ho

import { Request, Response } from "express";
import ApiError from "../../../utils/APIerror";
import ApiResponse from "../../../utils/ApiResponse";
import User from "../../../database/models/user.model";

class AuthUser {
  async RegisterUser(req: Request, res: Response) {
    interface UserInput {
      username: string;
      email: string;
      password: string;
    }
    const { username, email, password }: UserInput = req.body;

    if (!username || !email || !password) {
      throw new ApiError(400, "Enter a valid input");
    }

    try {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        throw new ApiError(409, "User already exist"); //409 chi dublicate user ko lagi use hunxa
      }

      const user = await User.create({
        username,
        email,
        password,
      });
      const userData = user.get({ plain: true }); // given data lai obj anusar lakhnu like { usernaem: "hari"}

      const { password: _, ...safeUserData } = userData; //destructuring ho jsla chi password lai chi remove gardinca

      return res
        .status(201) //used for the created things
        .json(
          new ApiResponse(
            200,
            safeUserData,
            "The user is successfully registered"
          )
        );
    } catch (error) {
      throw new ApiError(400, "Registration failed");
    }
  }
}

export default AuthUser;