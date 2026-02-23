'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('university', 'map', {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '', // Added default value to avoid issues with existing data
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('university', 'map');
}
