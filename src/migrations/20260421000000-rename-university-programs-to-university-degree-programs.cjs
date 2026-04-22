"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the table from university_programs to university_degree_programs
    await queryInterface.renameTable('university_programs', 'university_degree_programs');

    // Add the degree_id column
    await queryInterface.addColumn('university_degree_programs', 'degree_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'degrees', // referenced table name
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the degree_id column
    await queryInterface.removeColumn('university_degree_programs', 'degree_id');

    // Rename the table back to university_programs
    await queryInterface.renameTable('university_degree_programs', 'university_programs');
  }
};
