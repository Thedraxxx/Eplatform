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
import { registerSchema } from "../../../database/schema/user.register";

class authController {
  async UserRegister(req: Request, res: Response) {
    interface UserInput {
      username: string;
      email: string;
      password: string;
    }
    console.log(req.body)
    const { username, email, password }: UserInput = req.body; //roles kina lidinum vands= BOLA attack bata bachna
       /* clean banauxa code lai (username = req.body.username) yesto 
    multiple times garnu bhanda samlai destructure garara rakdda ramro hunxa
    2) yesla undefined lidaina so always define value matra halney
    */

    if (!username || !email || !password) {
      throw new ApiError(400, "Enter a valid input");
    }

    try {
      const existingUser = await User.findOne({ where: { email } }); // yesla already db ma yo email xa ki xaina vanara return ma boolean value pathauxa

      if (existingUser) {
        throw new ApiError(409, "User already exist"); //409 chi dublicate user ko lagi use hunxa
      }

      const user = await User.create({
        // register xaina vana naya table banauxa Usser model use garara ra given data lai save garxa
        username,
        email,
        password,
      });
      const userData = user.get({ plain: true }); // given data lai obj anusar lakhnu like { usernaem: "hari"}

      const { password: _, ...safeUserData } = userData; //destructuring ho jsla chi password lai chi remove gardinca user lai show garnu vanda agadi

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

export default new authController();
