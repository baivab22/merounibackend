import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";
import Program from "../courses/Course.model.js";

class CollegeCourse extends Model {}

CollegeCourse.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Program, key: "id" },
      onDelete: "CASCADE",
    },
  },
  { sequelize, modelName: "college_course", timestamps: false }
);

College.belongsToMany(Program, {
  through: CollegeCourse,
  foreignKey: "college_id",
  as: "courses",
});
Program.belongsToMany(College, {
  through: CollegeCourse,
  foreignKey: "course_id",
  as: "colleges",
});

export default CollegeCourse;
