import { Request, Response } from "express";
import ApiError from "../../utils/APIerror";
import sequelize from "../../database/connection";
import generateRandomNumber from "../../utils/generateRandomNumber";
class InstituteContoller {
    async createInstitute(req: Request, res: Response) {
        const {
            instituteName,
            instituteEmail,
            institutePhoneNumber,
            instituteAddress,
        } = req.body;

        const institutePanNo = req.body.institutePanNo || null;
        const instituteVatNo = req.body.instituteVatNo || null;

        if (
            !instituteName ||
            !instituteEmail ||
            !institutePhoneNumber ||
            !instituteAddress ||
            !institutePanNo ||
            !instituteVatNo
        ) {
            throw new ApiError(400, "These feilds are required.");
        }

        //if the fields are legit
        //create table and insert the data
        const instituteNumber: number = generateRandomNumber();
        sequelize.query(`CREATE TABLE IF NOT EXIST institute_${instituteNumber} (
               ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE,
               instituteName VARCHAR(255) NOT NULL,
               instituteEmail VARCHAR(255) NOT NULL UNIQUE,
               instituteAddress VARCHAR(255) NOT NULL,
               institutePhoneNo VARCHAR(255) NOT NULL UNIQUE,
               institutePanNo VARCHAR(255),
               instituteVatNo VARCHAR(255),
               createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            )`);

        sequelize.query(
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
    }
}


export default new InstituteContoller();