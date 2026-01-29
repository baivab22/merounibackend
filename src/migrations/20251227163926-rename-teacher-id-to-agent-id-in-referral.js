import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // Check if teacher_id column exists before renaming
  const tableDescription = await queryInterface.describeTable("referral");

  if (tableDescription.teacher_id && !tableDescription.agent_id) {
    // Rename the column from teacher_id to agent_id
    await queryInterface.renameColumn("referral", "teacher_id", "agent_id");
  } else if (!tableDescription.agent_id) {
    // If teacher_id doesn't exist and agent_id doesn't exist, add agent_id
    await queryInterface.addColumn("referral", "agent_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "mu_users",
        key: "id",
      },
    });
  }
  // If agent_id already exists, do nothing
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("referral");

  if (tableDescription.agent_id && !tableDescription.teacher_id) {
    // Revert the column name back to teacher_id
    await queryInterface.renameColumn("referral", "agent_id", "teacher_id");
  } else if (tableDescription.agent_id) {
    // If agent_id exists but teacher_id also exists, remove agent_id
    await queryInterface.removeColumn("referral", "agent_id");
  }
}
