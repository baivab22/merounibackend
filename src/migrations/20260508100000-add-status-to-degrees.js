import Sequelize from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn("degrees", "status", {
    type: Sequelize.ENUM("draft", "published"),
    allowNull: false,
    defaultValue: "published",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("degrees", "status");
}
