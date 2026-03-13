'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('material_category_order', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        parent_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },
        context: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'MATERIAL'
        },
        position: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
    });

    await queryInterface.addConstraint('material_category_order', {
        fields: ['category_id', 'parent_id', 'context'],
        type: 'unique',
        name: 'unique_category_order_context'
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('material_category_order');
}
