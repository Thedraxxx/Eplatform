//why use this format 
// 1) centralized error handling, cleaner code,
// 2) easier debugging with stack


class ApiError extends Error{  //Error chi js ko built in funciotn ho hai error handling ko lagi 
     
   statusCode: number;  //like 400, 402 etc
   data: any; // null most of the time
   message: string;  // eg:- email is required
   success: boolean; // its alwys false
   error: any[]; //error details
   stack?: string | undefined; // debugging ma help garcxa

    constructor(  // yo chi obj create vo vana call hunxa automatically 
     statusCode: number,
     message = "something goes wrong",
     error= [],
     stack ="",
   ){
    super(message); // massege lai parent class Error lai pathauxa
    // object ma assign garako
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.error = error;
    this.success = false

    if(stack){
        this.stack = stack
    }
    else{
        Error.captureStackTrace(this, this.constructor) // just helps in debugging tati bujda vo
    }
   }
}

export default ApiError;

