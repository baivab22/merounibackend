import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";
import Program from "../program/Program.model.js";

class CollegeOfferingProgram extends Model {}

CollegeOfferingProgram.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Program, key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "college_offering_program",
    tableName: "college_offering_programs",
    timestamps: false,
  },
);

export default CollegeOfferingProgram;
