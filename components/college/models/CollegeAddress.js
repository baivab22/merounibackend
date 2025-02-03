import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";
import College from "../models/CollegeModel.js";

class CollegeAddress extends Model {}

CollegeAddress.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    country: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    street: { type: DataTypes.STRING },
    postal_code: { type: DataTypes.STRING },
  },
  { sequelize, modelName: "college_address", timestamps: false }
);

College.hasOne(CollegeAddress, { foreignKey: "college_id", as: "address" });

export default CollegeAddress;
