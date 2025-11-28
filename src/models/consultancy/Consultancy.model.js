import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Course from "../courses/Course.model.js";

class Consultancy extends Model {}

Consultancy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slugs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    address: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pinned: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "published",
    },
    visibility: {
      type: DataTypes.ENUM("public", "private"),
      defaultValue: "public",
    },
  },
  {
    sequelize,
    modelName: "consultancies",
    tableName: "consultancies",
    timestamps: true,
  }
);

Consultancy.belongsToMany(Course, {
  through: "consultancy_courses",
  foreignKey: "consultancy_id",
  otherKey: "course_id",
  as: "consultancyCourses",
});

Course.belongsToMany(Consultancy, {
  through: "consultancy_courses",
  foreignKey: "course_id",
  otherKey: "consultancy_id",
  as: "coursesConsultancy",
});

export default Consultancy;
