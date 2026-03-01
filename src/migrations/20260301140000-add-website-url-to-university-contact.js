"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable("university_contact");
  if (!tableInfo.website_url) {
    await queryInterface.addColumn("university_contact", "website_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
}

export async function down(queryInterface) {
  const tableInfo = await queryInterface.describeTable("university_contact");
  if (tableInfo.website_url) {
    await queryInterface.removeColumn("university_contact", "website_url");
  }
}
