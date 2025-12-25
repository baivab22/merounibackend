import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn("referral", "student_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await queryInterface.addColumn("referral", "student_name", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("referral", "student_phone_no", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("referral", "student_email", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("referral", "student_description", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("referral", "course_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("referral", "student_id");
  await queryInterface.removeColumn("referral", "student_name");
  await queryInterface.removeColumn("referral", "student_phone_no");
  await queryInterface.removeColumn("referral", "student_email");
  await queryInterface.removeColumn("referral", "student_description");
  await queryInterface.removeColumn("referral", "course_id");
}
