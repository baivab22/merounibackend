import "dotenv/config"


class EnvConfig {
    constructor() {
        this.PORT = process.env.PORT;
        this.NODE_ENV = process.env.NODE_ENV;
        this.VERSION = process.env.VERSION;
        this.EMAIL = process.env.EMAIL;
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
        this.PASSWORD = process.env.PASSWORD;

        // auth config
        this.ACCESS_TOKEN = process.env.ACCESS_TOKEN;
        this.REFRESH_TOKEN = process.env.REFRESH_TOKEN;
        this.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
        this.ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
        
        // database config
        this.DB_HOST = process.env.DB_HOST;
        this.DB_USER = process.env.DB_USER;
        this.DB_PASS = process.env.DB_PASS;
        this.DB_NAME = process.env.DB_NAME;
        this.DB_PORT = process.env.DB_PORT;
        // ftp config
        this.FTP_HOST = process.env.FTP_HOST;
        this.FTP_USER = process.env.FTP_USER;
        this.FTP_PASS = process.env.FTP_PASS;
        this.FTP_PORT = process.env.FTP_PORT;
        // production url
        this.PRODUCTION_URL = process.env.PRODUCTION_URL;
    }
}

const envConfig =  new EnvConfig();

export default envConfig;