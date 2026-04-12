import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");

  // Remove eligibilityCriteria column if it exists
  if (tableDescription.eligibilityCriteria) {
    await queryInterface.removeColumn("scholarships", "eligibilityCriteria");
  }

  // Remove renewalCriteria column if it exists
  if (tableDescription.renewalCriteria) {
    await queryInterface.removeColumn("scholarships", "renewalCriteria");
  }

  // Make amount field optional (allowNull: true)
  if (tableDescription.amount) {
    await queryInterface.changeColumn("scholarships", "amount", {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("scholarships");

  // Restore eligibilityCriteria column if missing
  if (!tableDescription.eligibilityCriteria) {
    await queryInterface.addColumn("scholarships", "eligibilityCriteria", {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    });
  }

  // Restore renewalCriteria column if missing
  if (!tableDescription.renewalCriteria) {
    await queryInterface.addColumn("scholarships", "renewalCriteria", {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    });
  }

  // Restore amount as required (allowNull: false)
  if (tableDescription.amount) {
    await queryInterface.changeColumn("scholarships", "amount", {
      type: DataTypes.STRING(255),
      allowNull: false,
    });
  }
}
