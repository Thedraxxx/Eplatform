import { error } from "console";
import ApiError from "../utils/APIerror";
import {Request, Response, NextFunction, ErrorRequestHandler} from "express"


const errorHandler: ErrorRequestHandler  = (err,req,res,next)=>{
      console.error("🔥 Error caught by middleware:", err);
  if(err instanceof ApiError){

    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        success: err.success,
        message: err.message,
        data: err.data,
        error: err.error,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
     })
    return;
  }

   res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
    data:null,
    error: [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
  return;
}
export default errorHandler;