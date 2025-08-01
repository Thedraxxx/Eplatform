import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/APIerror";
import sequelize from "../../database/connection";
import generateRandomNumber from "../../utils/generateRandomNumber";
import ApiResponse from "../../utils/ApiResponse";
import User from "../../database/models/user.model";
import { IExtedREquest } from "../../utils/types";
import categories from "../../seed";
import slug from "../../utils/slugify";
import { QueryTypes } from "sequelize";
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
               id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
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
  async createTeacherTable(req: IExtedREquest, res: Response,next: NextFunction ) {
       const{teacherName, teacherPhoneNnumber, teacherCourse} = req.body;
       const instituteNumber = req.user?.currentInstituteNumber;
       if(!instituteNumber){
        throw new ApiError(401,"no institute number..")
       }
         await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
             id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
            teacherName VARCHAR(255) NOT NULL ,
            teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
            teacherEmail VARCHAR(255) NOT NULL UNIQUE,
            teacherPhoto VARCHAR(225),
            teacherSalary VARCHAR(100),
            joinedDate DATE,
            teacherPassword VARCHAR(255),
            courseId VARCHAR(36) REFERENCES course_${instituteNumber}(id),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);
        next();
  }
   async createStudentTable(req:IExtedREquest,res: Response,next: NextFunction){
        const instituteNumber= req.user?.currentInstituteNumber
         if(!instituteNumber){
        throw new ApiError(401,"no institute number..")
       }
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
             id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
            studentName VARCHAR(255) NOT NULL,
            studentEmail VARCHAR(255) NOT NULL,
            studentPhoneNo VARCHAR(255) NOT NULL UNIQUE,
            studentAddress TEXT,
            enrolledDate DATE,
            studentImage VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);
        next()
 }
 async createCategoryTable(req: IExtedREquest,res: Response,next: NextFunction){
             const instituteNumber = req.user?.currentInstituteNumber;
 await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber}(
     id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
    categoryName VARCHAR(255) NOT NULL UNIQUE, 
    categorySlug VARCHAR(255) NOT NULL UNIQUE,
    categoryDescription TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);

   for(const category of categories){
    const categorySlug = slug(category.categoryName);

    await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName,categorySlug,categoryDescription) VALUES (?,?,?)`,{
      type: QueryTypes.INSERT,
      replacements: [category.categoryName,categorySlug,category.categoryDescription]
    })
   }

  next()
 }
 async createCourseTable(req: IExtedREquest, res: Response, next: NextFunction){
         const instituteNumber= req.user?.currentInstituteNumber
         if(!instituteNumber){
        throw new ApiError(401,"no institute number..")
       }
       await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
        courseName VARCHAR(255) NOT NULL UNIQUE,
        coursePrice VARCHAR(255) NOT NULL,
        courseDiscription TEXT NOT NULL,
        courseDuration VARCHAR(100) NOT NULL,
        courseLevel ENUM('beginner','intermediate','advance') NOT NULL,
        courseThumbnail VARCHAR(255) NOT NULL,
        courseSyllabus VARCHAR(255),
        teacherId VARCHAR(36) REFERENCES teacher_${instituteNumber}(id),
        categoryId VARCHAR(36) NOT NULL REFERENCES category_${instituteNumber}(id),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);
      return res.json(instituteNumber)
 }
}


export default new InstituteContoller();
