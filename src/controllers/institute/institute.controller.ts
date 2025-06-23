import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/APIerror";
import sequelize from "../../database/connection";
import generateRandomNumber from "../../utils/generateRandomNumber";
import ApiResponse from "../../utils/ApiResponse";
import User from "../../database/models/user.model";
class InstituteContoller {
    async createInstitute(req: Request, res: Response, next: NextFunction) {
        const {
            instituteName,
            instituteEmail,
            institutePhoneNumber,
            instituteAddress,
        } = req.body;
        console.log(req.body)
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
                    instituteVatNo
                ],
            }
        );
       const {userId, currentInstituteNumber} = req.body;
     const result = await User.update({
        currentInstituteNumber: instituteNumber,
       },{
        where: userId
       });
       console.log("Result aayo: ",result);
        return res.json(
            new ApiResponse(200,null,"institute creared")
        )
        next();
    }
    
}

const createTeacherTable = async()=>{

}

export default new InstituteContoller();