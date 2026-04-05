import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Board extends Model { }

Board.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Board",
    tableName: "boards",
    timestamps: true,
  }
);

export default Board;
