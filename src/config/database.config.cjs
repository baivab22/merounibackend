// use this config for migration and seeding
// import envConfig from "./env.config.js";
const envConfig = require("./env.config.js").default;

module.exports = {
  development: {
    username: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    database: envConfig.DB_NAME,
    host: envConfig.DB_HOST,
    port: parseInt(envConfig.DB_PORT) || 3306,
    dialect: "mysql",
  },
  production: {
    username: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    database: envConfig.DB_NAME,
    host: envConfig.DB_HOST,
    port: parseInt(envConfig.DB_PORT) || 3306,
    dialect: "mysql",
  },
};
