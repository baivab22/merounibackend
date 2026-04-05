import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Stream extends Model { }

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
      unique: true,
    },
    board_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
  }
);

export default Stream;
