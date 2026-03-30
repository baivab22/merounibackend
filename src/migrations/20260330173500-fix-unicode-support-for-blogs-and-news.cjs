'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Fix for "Incorrect string value" error (Unicode/Emoji support)
     * This alters the character set and collation to utf8mb4
     */
    
    // Get current database name
    const [results] = await queryInterface.sequelize.query('SELECT DATABASE() as db');
    const dbName = results[0].db;

    // 1. Alter the database character set
    if (dbName) {
      await queryInterface.sequelize.query(
        `ALTER DATABASE \`${dbName}\` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci`
      );
    }

    // 2. Alter the blogs table and its columns
    await queryInterface.sequelize.query(
      'ALTER TABLE blogs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );

    // 3. Alter the news table and its columns
    await queryInterface.sequelize.query(
      'ALTER TABLE news CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Revert to utf8 (3-byte)
     * Note: This might cause issues if 4-byte characters (emojis) are already stored.
     */
    await queryInterface.sequelize.query(
      'ALTER TABLE blogs CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci'
    );

    await queryInterface.sequelize.query(
      'ALTER TABLE news CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci'
    );
  }
};
