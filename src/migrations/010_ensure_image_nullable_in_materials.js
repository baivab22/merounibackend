import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // Ensure image column is nullable
  await queryInterface.changeColumn("materials", "image", {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  // Revert image column back to NOT NULL (if it was previously)
  // Note: This might fail if there are null values
  await queryInterface.changeColumn("materials", "image", {
    type: DataTypes.STRING,
    allowNull: false,
  });
}
