import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

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
    institute_level: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: "institute_level",
    },
    is_featured: {
      type: DataTypes.TINYINT,
      allowNull: true,
      field: "is_featured",
      defaultValue: 0,
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
    college_broucher: {
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
  {
    sequelize,
    modelName: "colleges",
    tableName: "colleges",
    timestamps: true,
    freezeTableName: true,
  }
);

export default College;
