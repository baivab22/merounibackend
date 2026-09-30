import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  // Map any existing legacy plan rows into a valid new level before altering the ENUM
  await queryInterface.sequelize.query(
    `UPDATE student_memberships SET membership_type = 'PLUS2' WHERE membership_type IN ('BASIC', 'PREMIUM', 'PRO')`
  );

  await queryInterface.changeColumn("student_memberships", "membership_type", {
    type: DataTypes.ENUM("PLUS2", "BACHELORS", "GRADUATE"),
    allowNull: false,
  });

  await queryInterface.addColumn("student_memberships", "career_field", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("student_memberships", "selected_trainings", {
    type: DataTypes.TEXT,
    allowNull: true,
  });
  await queryInterface.addColumn("student_memberships", "institution", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("student_memberships", "payment_method", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("student_memberships", "membership_fee", {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("student_memberships", "membership_fee");
  await queryInterface.removeColumn("student_memberships", "payment_method");
  await queryInterface.removeColumn("student_memberships", "institution");
  await queryInterface.removeColumn("student_memberships", "selected_trainings");
  await queryInterface.removeColumn("student_memberships", "career_field");

  await queryInterface.sequelize.query(
    `UPDATE student_memberships SET membership_type = 'BASIC' WHERE membership_type IN ('PLUS2', 'BACHELORS', 'GRADUATE')`
  );

  await queryInterface.changeColumn("student_memberships", "membership_type", {
    type: DataTypes.ENUM("BASIC", "PREMIUM", "PRO"),
    allowNull: false,
  });
}