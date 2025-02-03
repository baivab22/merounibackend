import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";
import User from "../../users/model/UserModel.js";
import Faculty from "../../faculty/model/FacultyModel.js";

class Course extends Model {}

Course.init(
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
    },
    slugs: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    syllabus: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isFeatured: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      field: "is_featured"
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mu_users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "faculty",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "course",
    tableName: "courses",
    timestamps: true,
  }
);

Course.belongsTo(User, { foreignKey: "authorId", as: "author" });
Course.belongsTo(Faculty, { foreignKey: "facultyId", as: "faculty" });

export default Course;
