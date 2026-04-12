import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // Tables to update
  const tables = ["courses", "colleges_schools"];

  for (const table of tables) {
    const tableDescription = await queryInterface.describeTable(table);

    if (!tableDescription.status) {
      await queryInterface.addColumn(table, "status", {
        type: DataTypes.ENUM("draft", "published", "archived"),
        allowNull: false,
        defaultValue: "published",
      });
    }

    if (!tableDescription.meta_description) {
      await queryInterface.addColumn(table, "meta_description", {
        type: DataTypes.TEXT,
        allowNull: true,
      });
    }
  }
}

export async function down(queryInterface) {
  const tables = ["courses", "colleges_schools"];

  for (const table of tables) {
    const tableDescription = await queryInterface.describeTable(table);

    if (tableDescription.status) {
      await queryInterface.removeColumn(table, "status");
    }

    if (tableDescription.meta_description) {
      await queryInterface.removeColumn(table, "meta_description");
    }
  }
}
