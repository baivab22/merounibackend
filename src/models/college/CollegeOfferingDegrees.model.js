import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";
import Degree from "../degree/Degree.model.js";

class CollegeOfferingDegrees extends Model {}

CollegeOfferingDegrees.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    degree_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Degree, key: "id" },
      onDelete: "CASCADE",
    },
  },
  { 
    sequelize, 
    modelName: "college_offering_degrees", 
    timestamps: true 
  }
);

export default CollegeOfferingDegrees;
