'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('materials', 'order_no_for_website', {
        type: Sequelize.INTEGER,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('materials', 'order_no_for_website');
}
