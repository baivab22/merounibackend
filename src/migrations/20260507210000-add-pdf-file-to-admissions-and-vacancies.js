'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('college_admissions', 'pdf_file', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
  await queryInterface.addColumn('vacancies', 'pdf_file', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('college_admissions', 'pdf_file');
  await queryInterface.removeColumn('vacancies', 'pdf_file');
}
