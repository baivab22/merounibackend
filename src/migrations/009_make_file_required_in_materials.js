import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // Change file column to NOT NULL
  // Note: This will fail if there are existing materials with null file values
  // In that case, you'll need to update or delete those records first
  await queryInterface.changeColumn("materials", "file", {
    type: DataTypes.STRING,
    allowNull: false,
  });
}

export async function down(queryInterface) {
  // Revert file column back to nullable
  await queryInterface.changeColumn("materials", "file", {
    type: DataTypes.STRING,
    allowNull: true,
  });
}
