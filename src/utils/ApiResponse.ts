class ApiResponse {
    statusCode: number; // ya chi 200 ko range ko status code lagxa
    data: any;  // datas to send to the frontend to show
    message: string; // message lai chi just vayo vanara description dinu
    success: boolean;
     constructor(statusCode: number, data: any, message: string = "success"){
           this.statusCode = statusCode;
            this.data = data;
            this.message = message;
            this.success = true
     }
}

export default ApiResponse