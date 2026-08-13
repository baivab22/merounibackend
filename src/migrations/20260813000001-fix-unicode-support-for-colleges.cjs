'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Fix for "Incorrect string value" error (Unicode/Emoji support)
     * for colleges and related tables. This alters the character set
     * and collation to utf8mb4 so content/description can store special
     * characters (emoji, 4-byte UTF-8) without failing.
     */

    const tables = await queryInterface.showAllTables();

    const targetTables = [
      'colleges_schools',
      'college_addresses',
      'college_contacts',
      'college_facility',
      'college_gallery',
      'college_galleries',
      'college_members',
      'college_offering_programs',
      'college_offering_degrees',
      'college_rankings',
      'college_ranking_parents',
      'college_universities',
      'admissions',
      'career_guidance',
    ];

    for (const tableName of targetTables) {
      if (tables.includes(tableName)) {
        await queryInterface.sequelize.query(
          `ALTER TABLE \`${tableName}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Revert to utf8 (3-byte)
     * Note: This might cause issues if 4-byte characters (emojis) are already stored.
     */
    const tables = await queryInterface.showAllTables();

    const targetTables = [
      'colleges_schools',
      'college_addresses',
      'college_contacts',
      'college_facility',
      'college_gallery',
      'college_galleries',
      'college_members',
      'college_offering_programs',
      'college_offering_degrees',
      'college_rankings',
      'college_ranking_parents',
      'college_universities',
      'admissions',
      'career_guidance',
    ];

    for (const tableName of targetTables) {
      if (tables.includes(tableName)) {
        await queryInterface.sequelize.query(
          `ALTER TABLE \`${tableName}\` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci`
        );
      }
    }
  }
};
