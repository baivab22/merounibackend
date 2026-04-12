import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");

  if (!tableDescription.meta_description) {
    await queryInterface.addColumn("scholarships", "meta_description", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }

  if (!tableDescription.status) {
    await queryInterface.addColumn("scholarships", "status", {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "published",
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");

  if (tableDescription.meta_description) {
    await queryInterface.removeColumn("scholarships", "meta_description");
  }

  if (tableDescription.status) {
    await queryInterface.removeColumn("scholarships", "status");
    // Note: This might not remove the ENUM type from the database in some SQL dialects, 
    // but column removal is the primary concern for migration down.
  }
}
