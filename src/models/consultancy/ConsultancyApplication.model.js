import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Consultancy from "./Consultancy.model.js";
import User from "../users/User.model.js";

class ConsultancyApplication extends Model {}

ConsultancyApplication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    consultancy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Consultancy,
        key: "id",
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    student_phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    student_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    student_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("IN_PROGRESS", "ACCEPTED", "REJECTED"),
      allowNull: false,
      defaultValue: "IN_PROGRESS",
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    modelName: "consultancy_applications",
  }
);

// Associations
ConsultancyApplication.belongsTo(Consultancy, {
  foreignKey: "consultancy_id",
  as: "consultancy",
});

Consultancy.hasMany(ConsultancyApplication, {
  foreignKey: "consultancy_id",
  as: "applications",
});

ConsultancyApplication.belongsTo(User, {
  foreignKey: "student_id",
  as: "student",
});

export default ConsultancyApplication;
