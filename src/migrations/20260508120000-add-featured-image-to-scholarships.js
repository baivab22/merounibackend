import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");

  if (!tableDescription.featured_image) {
    await queryInterface.addColumn("scholarships", "featured_image", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");

  if (tableDescription.featured_image) {
    await queryInterface.removeColumn("scholarships", "featured_image");
  }
}
