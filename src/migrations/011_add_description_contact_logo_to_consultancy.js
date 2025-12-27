import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn("consultancies", "description", {
    type: DataTypes.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("consultancies", "contact", {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  });

  await queryInterface.addColumn("consultancies", "logo", {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("consultancies", "description");
  await queryInterface.removeColumn("consultancies", "contact");
  await queryInterface.removeColumn("consultancies", "logo");
}
