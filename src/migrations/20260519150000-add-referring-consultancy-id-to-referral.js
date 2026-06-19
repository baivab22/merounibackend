import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableInfo = await queryInterface.describeTable("referral");

  if (!tableInfo.referring_consultancy_id) {
    await queryInterface.addColumn("referral", "referring_consultancy_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "consultancies",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  }
}

export async function down(queryInterface) {
  const tableInfo = await queryInterface.describeTable("referral");

  if (tableInfo.referring_consultancy_id) {
    await queryInterface.removeColumn("referral", "referring_consultancy_id");
  }
}
