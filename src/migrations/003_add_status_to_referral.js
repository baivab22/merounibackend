import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn("referral", "status", {
    type: DataTypes.ENUM("IN_PROGRESS", "ACCEPTED", "REJECTED"),
    allowNull: false,
    defaultValue: "IN_PROGRESS",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("referral", "status");
}
