import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn("college_rankings", "program_list_order", {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  });

  // Create index on program_list_order for efficient querying
  await queryInterface.addIndex("college_rankings", ["program_list_order"], {
    name: "idx_program_list_order",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeIndex(
    "college_rankings",
    "idx_program_list_order"
  );
  await queryInterface.removeColumn("college_rankings", "program_list_order");
}
