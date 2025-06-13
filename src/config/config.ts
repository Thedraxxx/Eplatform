import {config} from "dotenv";
config();

export const envconfig ={
    portnumber : process.env.PORT,
    db_name: process.env.DB_NAME,
    db_username: process.env.DB_USER,
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_password: process.env.DB_PASSWORD,
    node_env: process.env.NODE_ENV,

    accesstoken_secret: process.env.ACCESS_TOKEN_SECRET,
    refreshToken_secret: process.env.REFRESH_TOKEN_SECRET,
    accessToken_expiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshToken_expiry: process.env.REFRESH_TOKEN_EXPIRY,
}
