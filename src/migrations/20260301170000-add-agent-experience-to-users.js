'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('mu_users', 'agent_experience', {
    type: Sequelize.TEXT,
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('mu_users', 'agent_experience');
}
