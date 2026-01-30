import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");

  if (!tableDescription.category) {
    await queryInterface.addColumn("scholarships", "category", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");

  if (tableDescription.category) {
    await queryInterface.removeColumn("scholarships", "category");
  }
}
