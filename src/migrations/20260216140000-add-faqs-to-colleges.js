'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('colleges', 'faqs', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('colleges', 'faqs');
}
