import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

class College extends Model {}

College.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slugs: { type: DataTypes.STRING, allowNull: false, unique: true },
    institute_type: {
      type: DataTypes.ENUM("Public", "Private", "Community", "Technical"),
      allowNull: false,
    },
    // institue_level: {
    //   type: DataTypes.JSON,
    //   allowNull: false,
    //   defaultValue: [],
    // },
    isFeatured: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      field: "is_featured",
    },
    pinned: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
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
    author_id: { type: DataTypes.INTEGER, allowNull: false },
    university_id: { type: DataTypes.INTEGER, allowNull: false },
    google_map_url: { type: DataTypes.STRING },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { sequelize, modelName: "college", timestamps: true }
);

export default College;
