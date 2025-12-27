import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class MaterialCategory extends Model {}

MaterialCategory.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "material_categories",
    freezeTableName: true,
    timestamps: true,
  }
);

export default MaterialCategory;
