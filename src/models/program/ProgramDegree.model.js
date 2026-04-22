import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class ProgramDegree extends Model {}

ProgramDegree.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "programs", key: "id" },
      onDelete: "CASCADE",
    },
    degree_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "degrees", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "ProgramDegree",
    tableName: "programs_degrees",
    timestamps: true,
  }
);

export default ProgramDegree;
