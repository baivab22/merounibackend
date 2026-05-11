"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = [
      "events",
      "college_admissions",
      "colleges_schools",
      "levels",
      "exams",
      "programs",
      "consultancies",
      "courses",
      "university",
      "tags",
      "vacancies",
      "scholarships",
      "categories",
      "careers",
      "faculties",
    ];

    for (const table of tables) {
      try {
        const tableDesc = await queryInterface.describeTable(table);
        if (tableDesc.slugs && !tableDesc.slug) {
          await queryInterface.renameColumn(table, "slugs", "slug");
        }
      } catch (error) {
        console.warn(`Could not rename slugs to slug in table ${table}: ${error.message}`);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = [
      "events",
      "college_admissions",
      "colleges_schools",
      "levels",
      "exams",
      "programs",
      "consultancies",
      "courses",
      "university",
      "tags",
      "vacancies",
      "scholarships",
      "categories",
      "careers",
      "faculties",
    ];

    for (const table of tables) {
      try {
        const tableDesc = await queryInterface.describeTable(table);
        if (tableDesc.slug && !tableDesc.slugs) {
          await queryInterface.renameColumn(table, "slug", "slugs");
        }
      } catch (error) {
        console.warn(`Could not rename slug to slugs in table ${table}: ${error.message}`);
      }
    }
  },
};
