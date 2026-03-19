import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

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
      allowNull: true,
      unique: true,
    },

    author: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    credits: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    language: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eligibility_criteria: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fee: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    scholarship_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    curriculum: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    learning_outcomes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
      allowNull: true,
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
