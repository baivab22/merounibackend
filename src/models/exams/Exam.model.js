import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import User from "../users/User.model.js";
import Level from "../level/Level.model.js";
import { University } from "../university/University.model.js";
import Category from "../category/Category.model.js";

class Exam extends Model { }

Exam.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "SET NULL",
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
      allowNull: true,
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
    // New flattened fields
    exam_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    full_marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pass_marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    questions_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    question_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: "exams",
    freezeTableName: true,
    timestamps: true,
  }
);

// Define the relationships:
Exam.belongsTo(User, { foreignKey: "author", as: "authorDetails" });
Exam.belongsTo(Level, { foreignKey: "level_id", as: "level" });
Exam.belongsTo(University, { foreignKey: "affiliation", as: "university" });
Exam.belongsTo(Category, { foreignKey: "category_id", as: "category" });

export { Exam };
