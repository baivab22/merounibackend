import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Discipline from "../discipline/Discipline.model.js";

class Program extends Model { }

Program.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    slugs: {
      type: DataTypes.STRING,
      unique: true,
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    duration: {
      type: DataTypes.STRING,
    },
    credits: {
      type: DataTypes.INTEGER,
    },
    level_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
      allowNull: true,
    },
    curriculum: {
      type: DataTypes.TEXT,
    },
    learning_outcomes: {
      type: DataTypes.TEXT,
    },
    delivery_type: {
      type: DataTypes.ENUM("Full-time", "Part-time", "Online", "Hybrid"),
      allowNull: true,
    },

    delivery_mode: {
      type: DataTypes.ENUM("On-campus", "Remote", "Blended"),
      allowNull: true,
    },

    careers: {
      type: DataTypes.TEXT,
    },
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    degree_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "degrees",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
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
