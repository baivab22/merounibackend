'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('mu_users', 'education_level', {
    type: Sequelize.STRING,
    allowNull: true
  });
  await queryInterface.addColumn('mu_users', 'further_education_plan', {
    type: Sequelize.TEXT,
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('mu_users', 'further_education_plan');
  await queryInterface.removeColumn('mu_users', 'education_level');
}
