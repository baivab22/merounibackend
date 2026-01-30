import { Model, DataTypes } from "sequelize";

import { sequelize } from "../../config/database.config.js";

class VacancyModel extends Model { }

VacancyModel.init(
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
      unique: true,
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
    associated_organization_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    featuredImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "featured_image",
    },
  },
  {
    sequelize,
    modelName: "vacancies",
    tableName: "vacancies",
    freezeTableName: true,
    underscored: false,
    timestamps: true,
  }
);

export default VacancyModel;
