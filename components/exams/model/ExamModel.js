import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";
import User from "../../users/model/UserModel.js";
import Level from "../../level/model/LevelModel.js";
import { University } from "../../university/model/UniversityModel.js";

class Exam extends Model {}

Exam.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slugs: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Use the actual model
        key: "id",
      },
      onDelete: "CASCADE",
    },
    level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Level, // Use the actual model
        key: "id",
      },
      onDelete: "CASCADE",
    },
    affiliation: {
      // Corrected spelling
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: University, // Use the actual model
        key: "id",
      },
      onDelete: "CASCADE",
    },
    syllabus: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pastQuestion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "exams",
    freezeTableName: true,
    timestamps: true,
  }
);

class ExamDetail extends Model {}
ExamDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    exam_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_marks: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pass_marks: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number_of_question: {
      type: DataTypes.INTEGER,
    },
    question_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "exam_details",
    freezeTableName: true,
    timestamps: false, // If you don't want timestamps in this table
  }
);

class ApplicationDetail extends Model {}
ApplicationDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    normal_fee: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    late_fee: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    exam_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    opening_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    closing_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "application_details",
    freezeTableName: true,
    timestamps: false,
  }
);

// Define the relationships:
Exam.hasMany(ExamDetail, { foreignKey: "exam_id", as: "exam_details" });
Exam.hasMany(ApplicationDetail, {
  foreignKey: "exam_id",
  as: "application_details",
});
Exam.belongsTo(User, { foreignKey: "author", as: "authorDetails" });
Exam.belongsTo(Level, { foreignKey: "level_id", as: "level" });
Exam.belongsTo(University, { foreignKey: "affiliation", as: "university" });

export { Exam, ExamDetail, ApplicationDetail };
