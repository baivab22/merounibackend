import Sequelize from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn("vacancies", "status", {
    type: Sequelize.ENUM("draft", "published"),
    allowNull: false,
    defaultValue: "published",
  });
  await queryInterface.addColumn("college_admissions", "status", {
    type: Sequelize.ENUM("draft", "published"),
    allowNull: false,
    defaultValue: "published",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("vacancies", "status");
  await queryInterface.removeColumn("college_admissions", "status");
}
