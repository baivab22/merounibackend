'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // 1. Add category_id to videos table
    await queryInterface.addColumn("videos", "category_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: "categories",
            key: "id",
        },
        onDelete: "SET NULL",
    });

    // 2. Update categories type enum to include 'VIDEO'
    await queryInterface.sequelize.query(`
        ALTER TABLE categories 
        MODIFY COLUMN type ENUM('BLOG', 'EVENT', 'NEWS', 'MATERIAL', 'SCHOLARSHIP', 'EXAM', 'VIDEO') 
        DEFAULT NULL
    `);
}

export async function down(queryInterface, Sequelize) {
    // 1. Remove category_id from videos table
    await queryInterface.removeColumn("videos", "category_id");

    // 2. Revert categories type enum
    await queryInterface.sequelize.query(`
        ALTER TABLE categories 
        MODIFY COLUMN type ENUM('BLOG', 'EVENT', 'NEWS', 'MATERIAL', 'SCHOLARSHIP', 'EXAM') 
        DEFAULT NULL
    `);
}
