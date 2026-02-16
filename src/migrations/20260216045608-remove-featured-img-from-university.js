'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('university', 'featured_img');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('university', 'featured_img', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}
