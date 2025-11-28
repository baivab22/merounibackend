import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Referral from "./Referral.model.js";

class ReferralStudent extends Model {}

ReferralStudent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    referral_id: {
      // Fixed foreign key name
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
    sequelize,
    timestamps: true,
    freezeTableName: true,
    tableName: "refer_student", // Fixed table name
  }
);

// Correct associations
Referral.hasMany(ReferralStudent, { foreignKey: "referral_id" });
ReferralStudent.belongsTo(Referral, { foreignKey: "referral_id" });

export default ReferralStudent;
