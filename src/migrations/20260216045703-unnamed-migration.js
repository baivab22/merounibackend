'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Check if column exists first to avoid error if manually added
  const tableInfo = await queryInterface.describeTable('university');
  if (!tableInfo.order_no_for_website) {
    await queryInterface.addColumn('university', 'order_no_for_website', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  }
}

export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('university');
  if (tableInfo.order_no_for_website) {
    await queryInterface.removeColumn('university', 'order_no_for_website');
  }
}
