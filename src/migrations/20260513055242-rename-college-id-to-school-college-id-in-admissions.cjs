"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "college_admissions",
      "college_id",
      "school_college_id",
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "college_admissions",
      "school_college_id",
      "college_id",
    );
  },
};
