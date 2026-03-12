import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.renameColumn("college_rankings", "program_list_order", "degree_list_order");
}

export async function down(queryInterface) {
  await queryInterface.renameColumn("college_rankings", "degree_list_order", "program_list_order");
}
