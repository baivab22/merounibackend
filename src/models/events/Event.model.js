import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Event extends Model { }

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slugs: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "colleges",
        key: "id",
      },
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mu_users",
        key: "id",
      },
    },
    is_featured: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      field: "is_featured",
    },
    description: {
      type: DataTypes.TEXT,

    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_host: {
      type: DataTypes.JSON,
      allowNull: false,
      field: "event_host",
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "published",
    },
    order_no_for_website: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "events",
    freezeTableName: true,
    modelName: "events",
    timestamps: true,
  }
);

export default Event;
