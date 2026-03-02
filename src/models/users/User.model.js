import { Model, DataTypes, Sequelize } from "sequelize";

import { sequelize } from "../../config/database.config.js";

class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "middle_name",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "phone_no",
    },
    roles: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: { student: false },
      // roles: admin, agent, editor, student, and institution
      validate: {
        isValidRoles(value) {
          const allowedRoles = [
            "admin",
            "agent",
            "editor",
            "student",
            "institution",
            "consultancy",
          ];
          const keys = Object.keys(value || {});
          const isValid = keys.every((role) => allowedRoles.includes(role));
          if (!isValid) {
            throw new Error("Invalid role(s) assigned");
          }
        },
      },
    },
    pendingRoles: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      field: "pending_roles",
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "otp_expiry_time",
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "profile_image_url",
    },
    cvUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "cv_url",
    },
    agentExperience: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "agent_experience",
    },
    createdByAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "created_by_admin",
    },
    collegeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "college_id",
    },
    consultancyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "consultancy_id",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
      field: "updatedAt",
    },
  },
  {
    sequelize,
    modelName: "mu_users",
    freezeTableName: true,
    underscored: false,
    timestamps: true,
  }
);
export default UserModel;
