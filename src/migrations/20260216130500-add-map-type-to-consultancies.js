'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('consultancies', 'map_type', {
        type: Sequelize.ENUM('embed_map_url', 'google_map_url'),
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('consultancies', 'map_type');
    // Note: Standard Sequelize ENUM removal for MySQL/PostgreSQL might require additional steps if not using simple drop column.
    // For most dev DBs, dropping the column is sufficient.
}
