import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Category extends Model { }

Category.init(
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
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    type: {
      type: DataTypes.ENUM("BLOG", "EVENT", "NEWS", "MATERIAL", "SCHOLARSHIP", "EXAM", "VIDEO", "CAREER"),
      allowNull: true,
    },
    parent_id: {
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
    modelName: "categories",
    freezeTableName: true,
    timestamps: true,
  }
);

Category.hasMany(Category, {
  foreignKey: "parent_id",
  as: "subcategories",
});

Category.belongsTo(Category, {
  foreignKey: "parent_id",
  as: "parent",
});

export default Category;
