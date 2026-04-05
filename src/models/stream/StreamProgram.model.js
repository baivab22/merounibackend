import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class StreamProgram extends Model { }

StreamProgram.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    stream_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "streams",
        key: "id",
      },
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "programs",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "StreamProgram",
    tableName: "stream_programs",
    timestamps: true,
  }
);

export default StreamProgram;
