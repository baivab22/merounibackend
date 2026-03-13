'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('materials', 'position', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('materials', 'position');
}
