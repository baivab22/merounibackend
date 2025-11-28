import { Sequelize } from "sequelize";

let { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_DIALECT, DB_PORT } = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  port: DB_PORT,
  host: DB_HOST,
  dialect: DB_DIALECT,
  sync: true,
});

export const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
