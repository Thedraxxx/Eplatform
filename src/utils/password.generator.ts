import bcrypt from "bcrypt"
function passwordGenerator(teacherName: string){
         const randomNumber = Math.floor(1000+ Math.random()*90000);
         const password ={
                 hashedPassword: bcrypt.hashSync(`${randomNumber}_${teacherName}`,10),
                 planePassword: `${randomNumber}_${teacherName}` 
         }
         return password;
}
export default passwordGenerator;