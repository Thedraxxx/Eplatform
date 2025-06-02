import app from "./src/app";
import { envconfig } from "./src/config/config";
import "./src/database/connection"

function startServer() {
  app.listen(envconfig.portnumber, function () {
    console.log(`The server is connected in this port ${envconfig.portnumber}`);
  });
}

startServer();
