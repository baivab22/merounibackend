'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('materials', 'tags');
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.addColumn('materials', 'tags', {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
    });
}
