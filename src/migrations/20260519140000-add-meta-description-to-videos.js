import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableInfo = await queryInterface.describeTable("videos");

  if (!tableInfo.meta_description) {
    await queryInterface.addColumn("videos", "meta_description", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }
}

export async function down(queryInterface) {
  const tableInfo = await queryInterface.describeTable("videos");

  if (tableInfo.meta_description) {
    await queryInterface.removeColumn("videos", "meta_description");
  }
}
