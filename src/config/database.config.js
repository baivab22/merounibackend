import "dotenv/config";
import { Sequelize } from "sequelize";
import envConfig from "./env.config.js"


console.log(envConfig, "envConfigenvConfig");


export const sequelize = new Sequelize(
  envConfig.DB_NAME,
  envConfig.DB_USER,
  envConfig.DB_PASS,
  {
    host: envConfig.DB_HOST,
    port: Number(envConfig.DB_PORT) || 3306,
    dialect: "mysql",
    // logging: true,
    // sync: true,
  }
);

export const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    const modelNames = Object.keys(sequelize.models);
    console.log("Models to sync:", modelNames);



    // if (envConfig.NODE_ENV.toLowerCase() === "development") {
    await sequelize.sync({
      // alter: true,
      // force: true,
    });
    // }
    console.log("Models synced");

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect  to the database:", error);
  }
};
