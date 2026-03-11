import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";


class News extends Model { }

News.init(
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


    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "colleges",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: false,
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

    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "draft",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "news",
    freezeTableName: true,
    timestamps: true,
  }
);

export default News;
