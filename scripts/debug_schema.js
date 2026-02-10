import { sequelize } from "../src/config/database.config.js";

async function checkSchema() {
  try {
    const [results, metadata] = await sequelize.query("DESCRIBE college_courses;");
    console.log("Schema for college_courses:", results);
  } catch (error) {
    console.error("Error describing table:", error);
  } finally {
    await sequelize.close();
  }
}

checkSchema();
