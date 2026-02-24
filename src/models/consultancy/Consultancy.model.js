import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Course from "../courses/Course.model.js";

class Consultancy extends Model { }

Consultancy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slugs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /** Array of country names (strings) only, e.g. ["Nepal", "Australia"] */
    destination: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },

    featured_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contact: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    google_map_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    map_type: {
      type: DataTypes.ENUM("embed_map_url", "google_map_url"),
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinned: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "published",
    },
    visibility: {
      type: DataTypes.ENUM("public", "private"),
      defaultValue: "public",
    },
    order_no_for_website: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "consultancies",
    tableName: "consultancies",
    timestamps: true,
  },
);

Consultancy.belongsToMany(Course, {
  through: "consultancy_courses",
  foreignKey: "consultancy_id",
  otherKey: "course_id",
  as: "consultancyCourses",
});

Course.belongsToMany(Consultancy, {
  through: "consultancy_courses",
  foreignKey: "course_id",
  otherKey: "consultancy_id",
  as: "coursesConsultancy",
});

export default Consultancy;
