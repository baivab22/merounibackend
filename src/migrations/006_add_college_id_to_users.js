import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn("mu_users", "college_id", {
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

export async function down(queryInterface) {
  await queryInterface.removeColumn("mu_users", "college_id");
}
