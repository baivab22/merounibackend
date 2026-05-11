import { sequelize } from "./src/config/database.config.js";

const tables = [
  "events",
  "college_admissions",
  "colleges_schools",
  "levels",
  "exams",
  "programs",
  "consultancies",
  "courses",
  "university",
  "tags",
  "vacancies",
  "scholarships",
  "categories",
  "careers",
  "faculties",
];

async function check() {
  for (const table of tables) {
    try {
      const [results] = await sequelize.query(`DESCRIBE ${table}`);
      const fields = results.map((r) => r.Field);
      console.log(`${table}: ${fields.join(", ")}`);
    } catch (e) {
      console.error(`Error for ${table}: ${e.message}`);
    }
  }
  process.exit();
}

check();
