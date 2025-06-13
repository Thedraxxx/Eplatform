import { Sequelize } from "sequelize-typescript"; // yo user garinxa type script ma
import { envconfig } from "../config/config";

const sequelize = new Sequelize({
  database: envconfig.db_name, //database ko name ho
  username: envconfig.db_username, //database ko username. default chi root hunxa
  port: Number(envconfig.db_port), // jaha chi database ko port chalxa
  password: envconfig.db_password,
  host: envconfig.db_host, //database ko location ho , for me its mycomputer(locaolhost)
  dialect: "mysql", //kun use garna mysql ki postgress ?
  models: [__dirname + "/models"],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Authenticated, connected");
  })
  .catch((error) => {
    console.log(error);
  });
//migrate garnu parxa
sequelize
  .sync({ force: false}) // yesla chi model lai Table ma convert garxa hai tw ... ra existing table xa bhana ignore garxa .. table xaina bhana naya table banauxa..
  .then(() => {
    console.log("migrated successfully new changes");
  });
export default sequelize;
