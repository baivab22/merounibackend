"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the column from teacher_id to agent_id
    await queryInterface.renameColumn("referral", "teacher_id", "agent_id");
  },

  async down(queryInterface, Sequelize) {
    // Revert the column name back to teacher_id
    await queryInterface.renameColumn("referral", "agent_id", "teacher_id");
  },
};
