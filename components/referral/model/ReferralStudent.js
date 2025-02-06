import { DataTypes } from "sequelize";

import { sequelize } from "../../../config/database.js";
import Referral from "./ReferralModel.js";

const ReferralStudent = sequelize.define(
  "refer_student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Referral,
        key: "id",
      },
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_phone_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    student_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Referral.hasMany(ReferralStudent, { foreignKey: "referral_id" });
ReferralStudent.belongsTo(Referral, { foreignKey: "referral_id" });

export default ReferralStudent;