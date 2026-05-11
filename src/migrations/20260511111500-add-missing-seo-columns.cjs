"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add slug to college_admissions if missing
    const collegeAdmissionsDesc =
      await queryInterface.describeTable("college_admissions");
    if (!collegeAdmissionsDesc.slug) {
      await queryInterface.addColumn("college_admissions", "slug", {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }
    if (!collegeAdmissionsDesc.meta_description) {
      await queryInterface.addColumn("college_admissions", "meta_description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // Add meta_description to other tables
    const tablesToFix = [
      "levels",
      "programs",
      "vacancies",
      "categories",
      "tags",
    ];

    for (const table of tablesToFix) {
      try {
        const desc = await queryInterface.describeTable(table);
        if (!desc.meta_description) {
          await queryInterface.addColumn(table, "meta_description", {
            type: Sequelize.TEXT,
            allowNull: true,
          });
        }
      } catch (error) {
        console.warn(
          `Could not add meta_description to table ${table}: ${error.message}`,
        );
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("college_admissions", "slug");
    await queryInterface.removeColumn("college_admissions", "meta_description");

    const tablesToFix = [
      "levels",
      "programs",
      "vacancies",
      "categories",
      "tags",
    ];

    for (const table of tablesToFix) {
      try {
        await queryInterface.removeColumn(table, "meta_description");
      } catch (error) {
        console.warn(
          `Could not remove meta_description from table ${table}: ${error.message}`,
        );
      }
    }
  },
};
