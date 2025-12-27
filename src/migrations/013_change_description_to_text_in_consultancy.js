import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.changeColumn("consultancies", "description", {
    type: DataTypes.TEXT,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.changeColumn("consultancies", "description", {
    type: DataTypes.STRING,
    allowNull: true,
  });
}
