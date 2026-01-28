import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Scholarship extends Model { }

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
    eligibilityCriteria: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    renewalCriteria: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    contactInfo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "scholarships",
    freezeTableName: true,
    timestamps: true,
  }
);

export default Scholarship;
