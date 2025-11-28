import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class ProgramSyllabus extends Model {}

ProgramSyllabus.init(
  {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_elective: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "program_syllabus",
    tableName: "program_syllabus",
    freezeTableName: true,
  }
);

export default ProgramSyllabus;
