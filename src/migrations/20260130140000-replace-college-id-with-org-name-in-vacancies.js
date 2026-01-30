import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("vacancies");

  if (!tableDescription.associated_organization_name) {
    await queryInterface.addColumn(
      "vacancies",
      "associated_organization_name",
      {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
    );
  }

  if (tableDescription.college_id) {
    await queryInterface.removeColumn("vacancies", "college_id");
  }
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("vacancies");

  if (tableDescription.associated_organization_name) {
    await queryInterface.removeColumn(
      "vacancies",
      "associated_organization_name"
    );
  }

  if (!tableDescription.college_id) {
    await queryInterface.addColumn("vacancies", "college_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "colleges",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  }
}
