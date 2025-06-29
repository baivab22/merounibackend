import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

class Program extends Model {}

Program.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slugs: {
      type: DataTypes.STRING,
      unique: true,
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    faculty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
    },
    credits: {
      type: DataTypes.INTEGER,
    },
    level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
    },
    eligibility_criteria: {
      type: DataTypes.TEXT,
    },
    fee: {
      type: DataTypes.TEXT,
    },
    scholarship_id: {
      type: DataTypes.INTEGER,
    },
    curriculum: {
      type: DataTypes.TEXT,
    },
    learning_outcomes: {
      type: DataTypes.TEXT,
    },
    delivery_type: {
      type: DataTypes.ENUM("Full-time", "Part-time", "Online", "Hybrid"),
      allowNull: false,
    },
    delivery_mode: {
      type: DataTypes.ENUM("On-campus", "Remote", "Blended"),
      allowNull: false,
    },
    careers: {
      type: DataTypes.TEXT,
    },
    exam_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "programs",
    tableName: "programs",
    freezeTableName: true,
  }
);

export default Program;
