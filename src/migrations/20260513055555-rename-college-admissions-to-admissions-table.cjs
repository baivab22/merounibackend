"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("college_admissions", "admissions");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable("admissions", "college_admissions");
  },
};
