import { Model, DataTypes,Sequelize } from "sequelize";

import { sequelize } from "../../../config/database.js";

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
      // roles: super-admin, admin, agent, editor, and student
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
