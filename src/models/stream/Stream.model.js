import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Stream extends Model {}

Stream.init(
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
      unique: "name_board_unique",
    },
    board_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "name_board_unique",
      references: {
        model: "boards",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Stream",
    tableName: "streams",
    timestamps: true,
  },
);

export default Stream;
