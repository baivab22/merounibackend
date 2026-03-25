import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class College extends Model { }

College.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slugs: { type: DataTypes.STRING, allowNull: false, unique: true },
    institute_type: {
      type: DataTypes.ENUM("Public", "Private", "Community", "Technical"),
      allowNull: false,
    },
    institute_level: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: "institute_level",
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    featured_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    college_logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    college_broucher: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
    google_map_url: { type: DataTypes.TEXT },

    map_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    faqs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: "faqs",
    },

    order_no_for_website: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      field: "order_no_for_website",
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "published",
    },
    is_referable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "colleges",
    tableName: "colleges",
    timestamps: true,
    freezeTableName: true,
  }
);

export default College;
