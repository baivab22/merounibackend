'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('materials', 'visibility');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('materials', 'visibility', {
    type: Sequelize.ENUM('public', 'private'),
    allowNull: false,
    defaultValue: 'public',
  });
}
