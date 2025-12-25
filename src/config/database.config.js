import "dotenv/config";
import { Sequelize } from "sequelize";

let { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  port: DB_PORT,
  host: DB_HOST,
  dialect: "mysql",
  sync: process.env.NODE_ENV === "production" ? false : true,
});

export const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
