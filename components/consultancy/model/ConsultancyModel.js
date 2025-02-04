import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

import Course from "../../courses/model/CourseModel.js";

class Consultancy extends Model {}

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
    },
    slugs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pinned: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    courses: {
      type: DataTypes.JSON,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    sequelize,
    modelName: "consultancy",
    tableName: "consultancies",
    timestamps: true,
  }
);

Consultancy.belongsTo(Course, { foreignKey: "courses" });

export default Consultancy;
