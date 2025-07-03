  import jwt from "jsonwebtoken";
  import { envconfig } from "../config/config";
  import {StringValue} from "ms"
  
  const generateToken = async(data: {id: string, instituteNumber ?: string})=>{
        return jwt.sign(
                 data,envconfig.accessToken_expiry as string,{expiresIn: envconfig.accessToken_expiry as StringValue}
        )
  }
 
  export default generateToken