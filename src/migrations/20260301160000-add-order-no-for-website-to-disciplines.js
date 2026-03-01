'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('disciplines', 'order_no_for_website', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('disciplines', 'order_no_for_website');
}
