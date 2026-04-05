import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn("programs", "stream_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "streams",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("programs", "stream_id");
}
