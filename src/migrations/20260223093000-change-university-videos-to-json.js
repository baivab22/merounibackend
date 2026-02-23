'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('university', 'videos', {
        type: Sequelize.JSONB,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('university', 'videos', {
        type: Sequelize.STRING,
        allowNull: true,
    });
}
