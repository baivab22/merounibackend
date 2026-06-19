import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableInfo = await queryInterface.describeTable("referral");

  if (tableInfo.student_id && !tableInfo.applying_student_id) {
    await queryInterface.renameColumn(
      "referral",
      "student_id",
      "applying_student_id",
    );
  } else if (!tableInfo.applying_student_id) {
    await queryInterface.addColumn("referral", "applying_student_id", {
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

  if (tableInfo.applying_student_id && !tableInfo.student_id) {
    await queryInterface.renameColumn(
      "referral",
      "applying_student_id",
      "student_id",
    );
  }
}
