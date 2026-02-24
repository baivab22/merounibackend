'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Use raw SQL to alter columns for better compatibility with ENUMs and constraints in MySQL/MariaDB
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN code VARCHAR(255) NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN author INTEGER NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN level_id INTEGER NULL');
    await queryInterface.sequelize.query("ALTER TABLE programs MODIFY COLUMN delivery_type ENUM('Full-time', 'Part-time', 'Online', 'Hybrid') NULL");
    await queryInterface.sequelize.query("ALTER TABLE programs MODIFY COLUMN delivery_mode ENUM('On-campus', 'Remote', 'Blended') NULL");
}

export async function down(queryInterface, Sequelize) {
    // Revert nullable fields to be mandatory (Note: this might fail if there are null values)
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN code VARCHAR(255) NOT NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN author INTEGER NOT NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN level_id INTEGER NOT NULL');
    await queryInterface.sequelize.query("ALTER TABLE programs MODIFY COLUMN delivery_type ENUM('Full-time', 'Part-time', 'Online', 'Hybrid') NOT NULL");
    await queryInterface.sequelize.query("ALTER TABLE programs MODIFY COLUMN delivery_mode ENUM('On-campus', 'Remote', 'Blended') NOT NULL");
}
