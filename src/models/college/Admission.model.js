import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";

class Admission extends Model {}

Admission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    school_college_id: {
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
    pdf_file: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "published",
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Admission",
    tableName: "admissions",
    freezeTableName: true,
    timestamps: false,
  },
);

export default Admission;
