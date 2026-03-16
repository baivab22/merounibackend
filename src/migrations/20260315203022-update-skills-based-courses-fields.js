'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('skills_based_courses', 'start_date', {
        type: Sequelize.STRING,
        allowNull: true,
    });
    await queryInterface.changeColumn('skills_based_courses', 'seats_available', {
        type: Sequelize.INTEGER,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('skills_based_courses', 'start_date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
    });
    // seats_available was already nullable, but if it wasn't we'd revert it here.
    // Since it was already nullable in the previous migration, we keep it as is.
}
