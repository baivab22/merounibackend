'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('materials', 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
    });

    // Also add file_url as an alias or just ensure it's there if they specifically want it.
    // Given 'file' already exists, I'll add 'file_url' as well to match user's request exactly.
    await queryInterface.addColumn('materials', 'file_url', {
        type: Sequelize.STRING,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('materials', 'description');
    await queryInterface.removeColumn('materials', 'file_url');
}
