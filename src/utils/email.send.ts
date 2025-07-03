import mail from "nodemailer";
import { envconfig } from "../config/config";
interface IMail {
        to: string,
        subject: string,
        message: string
}
const sendEmail = async(mailDetails: IMail)=>{
    //obje banauna 
    const transportMail = mail.createTransport({
       service: "gmail",
       auth: {
        user: envconfig.mailer_gmail,
        pass: envconfig.mailer_app_password,
       }
    });

    const emailFormat = {
         from: `E-Platform <${envconfig.mailer_gmail}>`,
         to: mailDetails.to,
         subject: mailDetails.subject,
         html: mailDetails.message
    }
    
   try {
     await transportMail.sendMail(emailFormat)
   } catch (error) {
    console.log(error)
   }
} 
export default sendEmail;