import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.changeColumn("categories", "type", {
    type: DataTypes.ENUM("BLOG", "EVENT", "NEWS"),
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.changeColumn("categories", "type", {
    type: DataTypes.ENUM("BLOG", "EVENT"),
    allowNull: true,
  });
}
