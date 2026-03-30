'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // 1. Add category_id to career table
    await queryInterface.addColumn("career", "category_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: "categories",
            key: "id",
        },
        onDelete: "SET NULL",
    });

    // 2. Update categories type enum to include 'CAREER'
    await queryInterface.sequelize.query(`
        ALTER TABLE categories 
        MODIFY COLUMN type ENUM('BLOG', 'EVENT', 'NEWS', 'MATERIAL', 'SCHOLARSHIP', 'EXAM', 'VIDEO', 'CAREER') 
        DEFAULT NULL
    `);
}

export async function down(queryInterface, Sequelize) {
    // 1. Remove category_id from career table
    await queryInterface.removeColumn("career", "category_id");

    // 2. Revert categories type enum
    await queryInterface.sequelize.query(`
        ALTER TABLE categories 
        MODIFY COLUMN type ENUM('BLOG', 'EVENT', 'NEWS', 'MATERIAL', 'SCHOLARSHIP', 'EXAM', 'VIDEO') 
        DEFAULT NULL
    `);
}
