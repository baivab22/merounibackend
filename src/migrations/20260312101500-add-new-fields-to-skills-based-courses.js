'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('skills_based_courses', 'class_time', {
        type: Sequelize.STRING,
        allowNull: true,
    });
    await queryInterface.addColumn('skills_based_courses', 'start_date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
    });
    await queryInterface.addColumn('skills_based_courses', 'class_days', {
        type: Sequelize.STRING,
        allowNull: true,
    });
    await queryInterface.addColumn('skills_based_courses', 'seats_available', {
        type: Sequelize.INTEGER,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('skills_based_courses', 'class_time');
    await queryInterface.removeColumn('skills_based_courses', 'start_date');
    await queryInterface.removeColumn('skills_based_courses', 'class_days');
    await queryInterface.removeColumn('skills_based_courses', 'seats_available');
}
