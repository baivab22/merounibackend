'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Add status column to programs table
    const tableInfo = await queryInterface.describeTable('programs');
    if (!tableInfo.status) {
        await queryInterface.addColumn('programs', 'status', {
            type: Sequelize.ENUM('draft', 'published'),
            allowNull: false,
            defaultValue: 'published',
        });
    }
}

export async function down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('programs');
    if (tableInfo.status) {
        await queryInterface.removeColumn('programs', 'status');
        // Note: To truly undo, you might need to drop the ENUM type if using Postgres, 
        // but for MySQL/SQLite it's usually handled by removeColumn.
    }
}
