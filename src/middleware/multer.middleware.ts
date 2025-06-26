import multer from "multer";
import fs from "fs"
import path from "path";

const uploadPath = path.join(__dirname,"../../public/temp");
if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath,{recursive: true}) // yesla public folder xaina vana banauxa
}
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
           cb(null,uploadPath)
    },
    filename: (req,file,cb)=>{
          cb(null,Date.now()+"-"+file.originalname)
    }
});
const limits = { 
    fileSize: 5*1024*1025 //5 mb
}
const upload = multer({
    storage,
    limits
})

export default upload;
