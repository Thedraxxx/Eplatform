import app from "./src/app";
import { envconfig } from "./src/config/config";
function startServer(){

   app.listen(envconfig.portnumber,function(){
    console.log(`The server is connected in this port ${envconfig.portnumber}`);
   })
}

startServer();