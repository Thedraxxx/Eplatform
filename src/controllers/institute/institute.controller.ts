import {Request,Response} from "express"


class InstituteContoller{
    async createInstitute(req: Request, res: Response){
         const {instituteName,instituteEmail,institutePhoneNumber,instituteAddress} = req.body;
         
    }
}