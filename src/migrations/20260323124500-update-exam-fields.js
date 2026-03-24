'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('exams');

  // Add conducted_by column if it doesn't exist
  if (!tableInfo.conducted_by) {
    await queryInterface.addColumn('exams', 'conducted_by', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }

  // Handle pastQuestion
  if (!tableInfo.pastQuestion) {
    await queryInterface.addColumn('exams', 'pastQuestion', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  } else {
    // If it's already JSON but has bad data (which shouldn't happen if it was successful)
    // We already have JSON in SHOW CREATE TABLE, so maybe it's fine.
    // If we want to ensure it is JSON without invalid data:
    await queryInterface.sequelize.query('UPDATE exams SET pastQuestion = NULL');
    
    await queryInterface.changeColumn('exams', 'pastQuestion', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });
  }

  // Handle affiliation - Change from INTEGER (with Foreign Key) to JSON
  if (tableInfo.affiliation) {
    // Explicitly drop foreign key constraints if they exist
    // Based on debug script, we have exams_ibfk_3 and exams_ibfk_4
    try {
      await queryInterface.sequelize.query('ALTER TABLE exams DROP FOREIGN KEY exams_ibfk_3');
    } catch (e) { /* ignore if not exists */ }
    try {
      await queryInterface.sequelize.query('ALTER TABLE exams DROP FOREIGN KEY exams_ibfk_4');
    } catch (e) { /* ignore if not exists */ }
    
    // Explicitly drop the index since MySQL doesn't allowed JSON columns to have standard indexes
    try {
      await queryInterface.sequelize.query('ALTER TABLE exams DROP INDEX affiliation');
    } catch (e) { /* ignore if not exists */ }

    await queryInterface.changeColumn('exams', 'affiliation', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });

    // Clear and convert data after conversion
    await queryInterface.sequelize.query('UPDATE exams SET affiliation = NULL');
  }
}

export async function down(queryInterface, Sequelize) {
  // Reverting would require re-adding constraints and changing type back
  // For safety, we keep it as is or implement a revert if really needed.
}
