'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Remove slug column
    await queryInterface.removeColumn('materials', 'slug');

    // Remove image column
    await queryInterface.removeColumn('materials', 'image');

    // Change file_url to nullable
    await queryInterface.changeColumn('materials', 'file_url', {
        type: Sequelize.STRING,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    // Add image column back
    await queryInterface.addColumn('materials', 'image', {
        type: Sequelize.STRING,
        allowNull: true,
    });

    // Add slug column back
    await queryInterface.addColumn('materials', 'slug', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    });

    // Change file_url to NOT nullable
    await queryInterface.changeColumn('materials', 'file_url', {
        type: Sequelize.STRING,
        allowNull: false,
    });
}
