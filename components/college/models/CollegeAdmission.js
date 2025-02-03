import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";
import College from "../models/CollegeModel.js";
import Program from "../../courses/model/CourseModel.js";

class CollegeAdmission extends Model {}

CollegeAdmission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Program, key: "id" },
      onDelete: "CASCADE",
    },
    eligibility_criteria: { type: DataTypes.TEXT },
    admission_process: { type: DataTypes.TEXT },
    fee_details: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "college_admission", timestamps: false }
);

College.hasMany(CollegeAdmission, { foreignKey: "college_id", as: "admissions" });
CollegeAdmission.belongsTo(College, { foreignKey: "college_id" });

export default CollegeAdmission;
