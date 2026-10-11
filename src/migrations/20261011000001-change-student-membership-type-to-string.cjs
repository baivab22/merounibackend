"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("student_memberships", "membership_type", {
      type: Sequelize.STRING(80),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("student_memberships", "membership_type", {
      type: Sequelize.ENUM("PLUS2", "BACHELORS", "GRADUATE"),
      allowNull: false,
    });
  },
};
