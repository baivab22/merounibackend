import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Scholarship extends Model {}

Scholarship.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slugs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    amount: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    applicationDeadline: {
      type: DataTypes.DATE,
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
    contactInfo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "published",
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "scholarships",
    freezeTableName: true,
    timestamps: true,
  },
);

export default Scholarship;
