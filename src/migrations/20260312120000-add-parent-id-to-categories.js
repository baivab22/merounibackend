'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'parent_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('categories', 'parent_id');
}
