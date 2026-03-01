'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('news', 'featured_image', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('news', 'featured_image', {
    type: Sequelize.STRING,
    allowNull: false,
  });
}
