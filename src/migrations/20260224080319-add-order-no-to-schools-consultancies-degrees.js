'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('consultancies', 'order_no_for_website', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('degrees', 'order_no_for_website', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('consultancies', 'order_no_for_website');
    await queryInterface.removeColumn('degrees', 'order_no_for_website');
}
