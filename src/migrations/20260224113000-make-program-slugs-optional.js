'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Make slugs nullable in programs table
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN slugs VARCHAR(255) NULL');
}

export async function down(queryInterface, Sequelize) {
    // Revert slugs to be mandatory
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN slugs VARCHAR(255) NOT NULL');
}
