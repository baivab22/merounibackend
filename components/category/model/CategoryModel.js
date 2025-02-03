import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

import Event from "../../events/model/EventModel.js";

class Category extends Model {}

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
    slugs: {
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
  },
  {
    sequelize,
    modelName: "categories",
    freezeTableName: true,
    timestamps: true,
  }
);

// Category.hasMany(Event, { foreignKey: "category_id", as: "events" });

export default Category;
