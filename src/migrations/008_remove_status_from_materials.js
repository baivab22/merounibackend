import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // Remove status column from materials table
  await queryInterface.removeColumn("materials", "status");
}

export async function down(queryInterface) {
  // Add status column back if migration is rolled back
  await queryInterface.addColumn("materials", "status", {
    type: DataTypes.ENUM("draft", "published", "archived"),
    allowNull: false,
    defaultValue: "draft",
  });
}
