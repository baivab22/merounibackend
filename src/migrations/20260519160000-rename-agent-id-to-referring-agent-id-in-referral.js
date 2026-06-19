import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableInfo = await queryInterface.describeTable("referral");

  if (tableInfo.agent_id && !tableInfo.referring_agent_id) {
    await queryInterface.renameColumn(
      "referral",
      "agent_id",
      "referring_agent_id",
    );
  } else if (!tableInfo.referring_agent_id) {
    await queryInterface.addColumn("referral", "referring_agent_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "mu_users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  }
}

export async function down(queryInterface) {
  const tableInfo = await queryInterface.describeTable("referral");

  if (tableInfo.referring_agent_id && !tableInfo.agent_id) {
    await queryInterface.renameColumn(
      "referral",
      "referring_agent_id",
      "agent_id",
    );
  }
}
