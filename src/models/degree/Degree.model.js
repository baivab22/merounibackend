import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Degree extends Model {}

Degree.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    short_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Degree",
    tableName: "degrees",
    freezeTableName: true,
    timestamps: true,
  }
);

export default Degree;
