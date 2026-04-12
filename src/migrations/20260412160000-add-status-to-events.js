import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("events");

  if (!tableDescription.status) {
    await queryInterface.addColumn("events", "status", {
      type: DataTypes.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "published",
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("events");

  if (tableDescription.status) {
    await queryInterface.removeColumn("events", "status");
  }
}
