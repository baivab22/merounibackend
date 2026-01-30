import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");
  if (tableDescription.amount) {
    await queryInterface.changeColumn("scholarships", "amount", {
      type: DataTypes.STRING(255),
      allowNull: false,
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");
  if (tableDescription.amount) {
    await queryInterface.changeColumn("scholarships", "amount", {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    });
  }
}
