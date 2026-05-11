import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import User from "../users/User.model.js";
import Faculty from "../faculty/Faculty.model.js";

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
    slug: {
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
      type: DataTypes.STRING,
      allowNull: true,
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
      field: "is_featured",
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
      allowNull: true,
      references: {
        model: "faculty",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "published",
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "meta_description",
    },
  },
  {
    sequelize,
    modelName: "course",
    tableName: "courses",
    timestamps: true,
  }
);

Course.belongsTo(User, { foreignKey: "authorId", as: "courseauthor" });
Course.belongsTo(Faculty, { foreignKey: "facultyId", as: "coursefaculty" });

export default Course;
