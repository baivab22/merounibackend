import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tables = await queryInterface.showAllTables();

  // 1. Rename college_programs to college_offering_programs
  if (
    tables.includes("college_programs") &&
    !tables.includes("college_offering_programs")
  ) {
    console.log("Renaming college_programs to college_offering_programs...");
    await queryInterface.renameTable(
      "college_programs",
      "college_offering_programs",
    );
  }

  // 2. Handle program_college unification
  if (tables.includes("program_college")) {
    console.log(
      "Migrating data from program_college to college_offering_programs...",
    );

    // Ensure we have the target table
    const currentTables = await queryInterface.showAllTables();
    if (currentTables.includes("college_offering_programs")) {
      // Insert data that doesn't already exist to avoid duplicates
      await queryInterface.sequelize.query(`
        INSERT INTO college_offering_programs (college_id, program_id)
        SELECT college_id, program_id FROM program_college
        WHERE NOT EXISTS (
          SELECT 1 FROM college_offering_programs 
          WHERE college_offering_programs.college_id = program_college.college_id 
          AND college_offering_programs.program_id = program_college.program_id
        )
      `);

      console.log("Dropping redundant program_college table...");
      await queryInterface.dropTable("program_college");
    }
  }
}

export async function down(queryInterface, Sequelize) {
  const tables = await queryInterface.showAllTables();
  if (
    tables.includes("college_offering_programs") &&
    !tables.includes("college_programs")
  ) {
    await queryInterface.renameTable(
      "college_offering_programs",
      "college_programs",
    );
  }
}
