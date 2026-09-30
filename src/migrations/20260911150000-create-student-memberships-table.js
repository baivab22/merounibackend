import { DataTypes } from "sequelize";
import Sequelize from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("student_memberships", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "mu_users", key: "id" },
      onDelete: "CASCADE",
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    student_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    student_phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    membership_type: {
      type: DataTypes.ENUM("BASIC", "PREMIUM", "PRO"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "EXPIRED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payment_proof_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  });
  await queryInterface.addIndex("student_memberships", ["student_id"], {
    name: "idx_student_memberships_student_id",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeIndex("student_memberships", "idx_student_memberships_student_id");
  await queryInterface.dropTable("student_memberships");
}