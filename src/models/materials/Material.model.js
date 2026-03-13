import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Category from "../category/Category.model.js";

class Material extends Model { }

Material.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mu_users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    sequelize,
    modelName: "materials",
    freezeTableName: true,
    timestamps: true,
  }
);

// Define associations
Material.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

Category.hasMany(Material, {
  foreignKey: "category_id",
  as: "materials",
});

export default Material;
