'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Add status column to colleges table
  const tableInfo = await queryInterface.describeTable('colleges');
  if (!tableInfo.status) {
    await queryInterface.addColumn('colleges', 'status', {
      type: Sequelize.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'published',
    });
  }
}

export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('colleges');
  if (tableInfo.status) {
    await queryInterface.removeColumn('colleges', 'status');
  }
}
