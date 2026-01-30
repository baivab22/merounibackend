// use this config for migration and seeding
<<<<<<< HEAD

// import like this only, else it wont find the env files.
const { default: envConfig } = require("./env.config.js");
=======
// import envConfig from "./env.config.js";
const envConfig = require("./env.config.js").default;
>>>>>>> e3eca320a75ae037338dc28c9bee7131884896dd

module.exports = {
  development: {
    username: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    database: envConfig.DB_NAME,
    dialect: "mysql",
    host: envConfig.DB_HOST,
    port: parseInt(envConfig.DB_PORT) || 3306,
    dialect: "mysql",
  },
  production: {
    username: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    database: envConfig.DB_NAME,
    dialect: "mysql",
    host: envConfig.DB_HOST,
    port: parseInt(envConfig.DB_PORT) || 3306,
    dialect: "mysql",
  },
};
