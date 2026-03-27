
import Degree from "../src/models/degree/Degree.model.js";
import CollegeRanking from "../src/models/college/CollegeRanking.model.js";
import College from "../src/models/college/College.model.js";
import { sequelize } from "../src/config/database.config.js";
import "../src/models/college/associations.js";

async function check() {
  try {
    const degrees = await Degree.findAll({
      attributes: ['id', 'title'],
      raw: true
    });
    console.log("--- All Degrees ---");
    console.table(degrees);

    for (const d of degrees) {
      if (d.title.includes("Information Technology") || d.title.includes("Business Administration")) {
        console.log(`\n--- Rankings for ${d.title} (ID: ${d.id}) ---`);
        
        // Raw query to see if ANY rankings exist for this degree
        const rawRankings = await CollegeRanking.findAll({
          where: { degree_id: d.id },
          order: [['rank', 'ASC']],
          raw: true
        });
        
        console.log("Raw rankings in database:");
        console.table(rawRankings.map(r => ({
          id: r.id,
          rank: r.rank,
          college_id: r.college_id
        })));

        // Included query to see if associations work
        const rankings = await CollegeRanking.findAll({
          where: { degree_id: d.id },
          include: [{ 
            model: College, 
            as: 'college', 
            attributes: ['id', 'name'],
            required: false
          }],
          order: [['rank', 'ASC']],
          raw: true,
          nest: true
        });
        
        console.log("Rankings with College associations:");
        console.table(rankings.map(r => ({
          rank: r.rank,
          college_id: r.college_id,
          college_name: r.college?.name || '--- COLLEGE DATA MISSING ---'
        })));
      }
    }
  } catch (error) {
    console.error("Debug script failed:", error);
  } finally {
    await sequelize.close();
  }
}

check();
