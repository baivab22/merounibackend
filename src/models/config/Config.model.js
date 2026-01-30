import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Config extends Model {}

Config.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "config",
    tableName: "configs",
    timestamps: true,
  }
);

export default Config;
