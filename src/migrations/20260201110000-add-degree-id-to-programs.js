import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("programs");

  if (!tableDescription.degree_id) {
    await queryInterface.addColumn("programs", "degree_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "degrees",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("programs");

  if (tableDescription.degree_id) {
    await queryInterface.removeColumn("programs", "degree_id");
  }
}
