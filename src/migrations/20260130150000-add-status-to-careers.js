import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableName = "career";
  const tableDescription = await queryInterface.describeTable(tableName);

  if (!tableDescription.status) {
    await queryInterface.addColumn(tableName, "status", {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("career");
  if (tableDescription.status) {
    await queryInterface.removeColumn("career", "status");
  }
}
