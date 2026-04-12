import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("events");

  if (!tableDescription.status) {
    await queryInterface.addColumn("events", "status", {
      type: DataTypes.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "published",
    });
  }

  if (!tableDescription.meta_description) {
    await queryInterface.addColumn("events", "meta_description", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }

  if (!tableDescription.order_no_for_website) {
    await queryInterface.addColumn("events", "order_no_for_website", {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("events");

  if (tableDescription.status) {
    await queryInterface.removeColumn("events", "status");
  }

  if (tableDescription.meta_description) {
    await queryInterface.removeColumn("events", "meta_description");
  }

  if (tableDescription.order_no_for_website) {
    await queryInterface.removeColumn("events", "order_no_for_website");
  }
}
