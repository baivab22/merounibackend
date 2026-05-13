"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Rename table
    await queryInterface.renameTable(
      "skills_based_courses",
      "short_term_courses",
    );

    // 2. Add status column if it doesn't exist
    // We use a try-catch because queryInterface doesn't have an easy "columnExists" in some versions
    try {
      await queryInterface.addColumn("short_term_courses", "status", {
        type: Sequelize.ENUM("draft", "published", "archived"),
        defaultValue: "published",
        allowNull: false,
      });
    } catch (e) {
      console.log(
        "Status column already exists or error adding it:",
        e.message,
      );
    }

    // 3. Add meta_description column if it doesn't exist
    try {
      await queryInterface.addColumn("short_term_courses", "meta_description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    } catch (e) {
      console.log(
        "meta_description column already exists or error adding it:",
        e.message,
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable(
      "short_term_courses",
      "skills_based_courses",
    );
    // Note: We don't necessarily remove columns in down to prevent data loss if they were there before
  },
};
