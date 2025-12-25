// use this config for migration and seeding
require("dotenv/config");

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: parseInt(DB_PORT) || 3306,
    dialect: "mysql",
  },
  production: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: parseInt(DB_PORT) || 3306,
    dialect: "mysql",
  },
};
