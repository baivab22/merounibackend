'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Add status column to university table
    const tableInfo = await queryInterface.describeTable('university');
    if (!tableInfo.status) {
        await queryInterface.addColumn('university', 'status', {
            type: Sequelize.ENUM('draft', 'published', 'archived'),
            allowNull: false,
            defaultValue: 'published',
        });
    }
}

export async function down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('university');
    if (tableInfo.status) {
        await queryInterface.removeColumn('university', 'status');
    }
}
