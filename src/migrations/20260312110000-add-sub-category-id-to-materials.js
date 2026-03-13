'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('materials', 'sub_category_id', {
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
    await queryInterface.removeColumn('materials', 'sub_category_id');
}
