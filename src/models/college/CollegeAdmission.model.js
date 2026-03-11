import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";

class CollegeAdmission extends Model { }

CollegeAdmission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eligibility_criteria: { type: DataTypes.TEXT },
    admission_process: { type: DataTypes.TEXT },
    fee_details: { type: DataTypes.TEXT },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "college_admission",
    tableName: "college_admission",
    freezeTableName: true,
    timestamps: false,
  }
);

College.hasMany(CollegeAdmission, {
  foreignKey: "college_id",
  as: "admissions",
});
CollegeAdmission.belongsTo(College, { foreignKey: "college_id" });

export default CollegeAdmission;
