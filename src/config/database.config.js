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

    for (const modelName of modelNames) {
      const model = sequelize.models[modelName];
      if (!model.name) {
        console.error(`Model ${modelName} has no name property!`);
      }
      for (const assocName in model.associations) {
        const assoc = model.associations[assocName];
        if (!assoc.target) {
          console.error(`Association ${assocName} in ${modelName} has no target!`);
        } else if (!assoc.target.name) {
          console.error(`Association ${assocName} in ${modelName} has a target without a name!`, assoc.target);
        }
      }
    }

    await sequelize.sync({
    });
    console.log("Models synced");

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect  to the database:", error);
  }
};
