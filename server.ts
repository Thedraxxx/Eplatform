import app from "./app";
import { envconfig } from "./src/config/config";
import "./src/database/connection" // hit the db 

function startServer() {
  app.listen(envconfig.portnumber, function () {
    console.log(`The server is connected in this port ${envconfig.portnumber}`);
  });
}

startServer();
