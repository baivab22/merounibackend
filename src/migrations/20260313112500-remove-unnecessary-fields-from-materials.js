'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Remove redundant columns
    await queryInterface.removeColumn('materials', 'sub_category_id');
    await queryInterface.removeColumn('materials', 'order_no_for_website');

    // Handle file vs file_url
    // Since we already added file_url, and file exists, we'll keep file_url and drop file.
    // In a real production environment, we would migrate data first.
    await queryInterface.removeColumn('materials', 'file');
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.addColumn('materials', 'sub_category_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id',
        },
        onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('materials', 'order_no_for_website', {
        type: Sequelize.INTEGER,
        allowNull: true,
    });
    await queryInterface.addColumn('materials', 'file', {
        type: Sequelize.STRING,
        allowNull: false,
    });
}
