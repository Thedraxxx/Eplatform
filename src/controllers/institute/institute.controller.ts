import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/APIerror";
import sequelize from "../../database/connection";
import generateRandomNumber from "../../utils/generateRandomNumber";
import ApiResponse from "../../utils/ApiResponse";
import User from "../../database/models/user.model";
import { IExtedREquest } from "../../utils/types";
class InstituteContoller {
  async createInstitute(req: IExtedREquest, res: Response, next: NextFunction) {
    const {
      instituteName,
      instituteEmail,
      institutePhoneNumber,
      instituteAddress,
    } = req.body;
    console.log(req.body);
    const institutePanNo = req.body.institutePanNo || null;
    const instituteVatNo = req.body.instituteVatNo || null;

    if (
      !instituteName ||
      !instituteEmail ||
      !institutePhoneNumber ||
      !instituteAddress
    ) {
      throw new ApiError(400, "These feilds are required.");
    }

    //if the fields are legit
    //create table and insert the data
    const instituteNumber: number = generateRandomNumber();
    await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
               ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
               instituteName VARCHAR(255) NOT NULL,
               instituteEmail VARCHAR(255) NOT NULL UNIQUE,
               instituteAddress VARCHAR(255) NOT NULL,
               institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
               institutePanNo VARCHAR(255),
               instituteVatNo VARCHAR(255),
               createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);
    await sequelize.query(
      `INSERT INTO institute_${instituteNumber} (instituteName,instituteEmail,institutePhoneNumber,instituteAddress,institutePanNo,
      instituteVatNo) VALUES (?,?,?,?,?,?)`,
      {
        replacements: [
          instituteName,
          instituteEmail,
          institutePhoneNumber,
          instituteAddress,
          institutePanNo,
          instituteVatNo,
        ],
      }
    );
   await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institutes(
          id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
          userId VARCHAR(255) REFERENCES users(id),
          instituteNumber VARCHAR(255) UNIQUE 
        )`);
        if(req.user){
       await sequelize.query(`INSERT INTO user_institutes(userId,instituteNumber) VALUES (?,?)`,{
        replacements: [
             req.user.id,
             instituteNumber
        ]
       });
       console.log(req.user?.id)
    const userId = req.user?.id;
    await User.update(
      {
        currentInstituteNumber: instituteNumber.toString(),
        role: "institute"
      },
      {
        where: { id: userId },
      }
    )
}
    if (req.user) {
      req.user.currentInstituteNumber = instituteNumber;
    }
    next();
  }
  async teacherController(req: IExtedREquest, res: Response,next: NextFunction ) {
       const{teacherName, teacherPhoneNnumber, teacherCourse} = req.body;
       const instituteNumber = req.user?.currentInstituteNumber;
       if(!instituteNumber){
        throw new ApiError(401,"no institute number..")
       }
         await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL ,
            phoneNumber VARCHAR(255) NOT NULL,
            course VARCHAR(255) NOT NULL
            )`)
          await sequelize.query(`INSERT INTO teacher_${instituteNumber}(name,phoneNumber,course) VALUES (?,?,?)`,{
              replacements: [
                "roshan","998898","science"
              ]
          })
            return res.status(200).json("vayo...")
  }
}

export default new InstituteContoller();
