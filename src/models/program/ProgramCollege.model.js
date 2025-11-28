import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Program from "./Program.model.js";
import College from "../college/College.model.js";

class ProgramCollege extends Model {}

ProgramCollege.init(
  {
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Program,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: College,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "program_college",
    tableName: "program_college",
    freezeTableName: true,
  }
);

export default ProgramCollege;
