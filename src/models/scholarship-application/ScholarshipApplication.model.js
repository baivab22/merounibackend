import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Scholarship from "../scholarship/Scholarship.model.js";
import UserModel from "../users/User.model.js";

class ScholarshipApplication extends Model {}

ScholarshipApplication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    scholarship_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Scholarship,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "scholarship_applications",
    freezeTableName: true,
    timestamps: true,
  }
);

// Associations
ScholarshipApplication.belongsTo(Scholarship, {
  foreignKey: "scholarship_id",
  as: "scholarship",
});

ScholarshipApplication.belongsTo(UserModel, {
  foreignKey: "student_id",
  as: "student",
});

Scholarship.hasMany(ScholarshipApplication, {
  foreignKey: "scholarship_id",
  as: "applications",
});

UserModel.hasMany(ScholarshipApplication, {
  foreignKey: "student_id",
  as: "scholarshipApplications",
});

export default ScholarshipApplication;
