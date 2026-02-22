'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('colleges', 'map_type', {
        type: Sequelize.STRING,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('colleges', 'map_type');
}
