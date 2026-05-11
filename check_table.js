import { sequelize } from "./src/config/database.config.js";

async function check() {
  try {
    const [results] = await sequelize.query("DESCRIBE college_admissions");
    console.log(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

check();
