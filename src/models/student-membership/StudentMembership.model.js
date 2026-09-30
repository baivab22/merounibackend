import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import UserModel from "../users/User.model.js";

class StudentMembership extends Model {}

StudentMembership.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    // Human-quotable payment reference shown to the member and searched by admins
    // when verifying an offline payment. e.g. MU-26-7F3K9QX2
    reference_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
      unique: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: UserModel,
        key: "id",
      },
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
    institution: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    membership_type: {
      type: DataTypes.ENUM("PLUS2", "BACHELORS", "GRADUATE"),
      allowNull: false,
    },
    career_field: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    selected_trainings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    membership_fee: {
      type: DataTypes.STRING,
      allowNull: true,
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
  },
  {
    sequelize,
    modelName: "student_memberships",
    freezeTableName: true,
    timestamps: true,
  }
);

// Associations
StudentMembership.belongsTo(UserModel, {
  foreignKey: "student_id",
  as: "student",
});

UserModel.hasMany(StudentMembership, {
  foreignKey: "student_id",
  as: "studentMemberships",
});

export default StudentMembership;