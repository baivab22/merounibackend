'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Add order_no_for_website to consultancies
  const consultancyTable = await queryInterface.describeTable('consultancies');
  if (!consultancyTable.order_no_for_website) {
    await queryInterface.addColumn('consultancies', 'order_no_for_website', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  }

  // Add order_no_for_website to degrees
  const degreeTable = await queryInterface.describeTable('degrees');
  if (!degreeTable.order_no_for_website) {
    await queryInterface.addColumn('degrees', 'order_no_for_website', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  }
}

export async function down(queryInterface, Sequelize) {
  const consultancyTable = await queryInterface.describeTable('consultancies');
  if (consultancyTable.order_no_for_website) {
    await queryInterface.removeColumn('consultancies', 'order_no_for_website');
  }

  const degreeTable = await queryInterface.describeTable('degrees');
  if (degreeTable.order_no_for_website) {
    await queryInterface.removeColumn('degrees', 'order_no_for_website');
  }
}
