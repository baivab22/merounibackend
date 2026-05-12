"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tablesToFix = [
      "colleges_schools",
      "disciplines",
      "degrees",
      "skills_based_courses",
    ];

    for (const table of tablesToFix) {
      try {
        const tableInfo = await queryInterface.describeTable(table);
        if (!tableInfo.meta_description) {
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
    const tablesToFix = [
      "colleges_schools",
      "disciplines",
      "degrees",
      "skills_based_courses",
    ];

    for (const table of tablesToFix) {
      try {
        const tableInfo = await queryInterface.describeTable(table);
        if (tableInfo.meta_description) {
          await queryInterface.removeColumn(table, "meta_description");
        }
      } catch (error) {
        console.warn(
          `Could not remove meta_description from table ${table}: ${error.message}`,
        );
      }
    }
  },
};
