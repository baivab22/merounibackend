import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Material from "./Material.model.js";
import User from "../users/User.model.js";

class MaterialHeart extends Model { }

MaterialHeart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    material_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "materials",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mu_users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "material_hearts",
    freezeTableName: true,
    timestamps: true,
  }
);

// Define associations
Material.hasMany(MaterialHeart, {
  foreignKey: "material_id",
  as: "hearts",
});

MaterialHeart.belongsTo(Material, {
  foreignKey: "material_id",
  as: "material",
});

User.hasMany(MaterialHeart, {
  foreignKey: "user_id",
  as: "materialHearts",
});

MaterialHeart.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

export default MaterialHeart;
