import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("colleges");

  if (!tableDescription.order_no_for_website) {
    await queryInterface.addColumn("colleges", "order_no_for_website", {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("colleges");

  if (tableDescription.order_no_for_website) {
    await queryInterface.removeColumn("colleges", "order_no_for_website");
  }
}
