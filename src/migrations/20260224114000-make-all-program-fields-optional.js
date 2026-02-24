'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Ensure ALL columns except title and id are optional
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN code VARCHAR(255) NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN slugs VARCHAR(255) NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN author INTEGER NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN duration VARCHAR(50) NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN credits DECIMAL(10,2) NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN level_id INTEGER NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN language VARCHAR(100) NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN eligibility_criteria TEXT NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN fee TEXT NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN scholarship_id INTEGER NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN curriculum TEXT NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN learning_outcomes TEXT NULL');
    await queryInterface.sequelize.query("ALTER TABLE programs MODIFY COLUMN delivery_type ENUM('Full-time', 'Part-time', 'Online', 'Hybrid') NULL");
    await queryInterface.sequelize.query("ALTER TABLE programs MODIFY COLUMN delivery_mode ENUM('On-campus', 'Remote', 'Blended') NULL");
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN careers TEXT NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN exam_id INTEGER NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN degree_id INTEGER NULL');
}

export async function down(queryInterface, Sequelize) {
    // Revert back (Note: many fields were already optional, this revert is best-effort)
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN code VARCHAR(255) NOT NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN author INTEGER NOT NULL');
    await queryInterface.sequelize.query('ALTER TABLE programs MODIFY COLUMN level_id INTEGER NOT NULL');
    await queryInterface.sequelize.query("ALTER TABLE programs MODIFY COLUMN delivery_type ENUM('Full-time', 'Part-time', 'Online', 'Hybrid') NOT NULL");
    await queryInterface.sequelize.query("ALTER TABLE programs MODIFY COLUMN delivery_mode ENUM('On-campus', 'Remote', 'Blended') NOT NULL");
}
