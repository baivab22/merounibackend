'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Add status column to exams table
    const tableInfo = await queryInterface.describeTable('exams');
    if (!tableInfo.status) {
        await queryInterface.addColumn('exams', 'status', {
            type: Sequelize.ENUM('draft', 'published'),
            allowNull: false,
            defaultValue: 'published',
        });
    }
}

export async function down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('exams');
    if (tableInfo.status) {
        await queryInterface.removeColumn('exams', 'status');
    }
}
