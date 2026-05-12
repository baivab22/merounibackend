"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("blogs");
    if (!tableInfo.meta_description) {
      await queryInterface.addColumn("blogs", "meta_description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("blogs");
    if (tableInfo.meta_description) {
      await queryInterface.removeColumn("blogs", "meta_description");
    }
  },
};
