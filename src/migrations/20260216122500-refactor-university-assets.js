'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Add columns to university table
    await queryInterface.addColumn('university', 'featured_image', {
        type: Sequelize.STRING,
        allowNull: true,
    });
    await queryInterface.addColumn('university', 'videos', {
        type: Sequelize.STRING,
        allowNull: true,
    });

    // Drop university_assets table
    await queryInterface.dropTable('university_assets');
}

export async function down(queryInterface, Sequelize) {
    // Re-create university_assets table
    await queryInterface.createTable('university_assets', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        featured_image: {
            type: Sequelize.STRING,
        },
        videos: {
            type: Sequelize.STRING,
        },
        university_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'university',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    });

    // Remove columns from university table
    await queryInterface.removeColumn('university', 'featured_image');
    await queryInterface.removeColumn('university', 'videos');
}
