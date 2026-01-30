import { Model, DataTypes } from "sequelize";

import { sequelize } from "../../config/database.config.js";

class CareerModel extends Model {}

CareerModel.init(
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
    slugs: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mu_users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    featuredImage: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "featured_image",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "career",
    freezeTableName: true,
    underscored: false,
    timestamps: true,
  }
);
export default CareerModel;
