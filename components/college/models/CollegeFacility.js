import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";
import College from "./CollegeModel.js";

class CollegeFacility extends Model {}

CollegeFacility.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "college_facility",
    timestamps: false,
    freezeTableName: true,
  }
);

College.hasOne(CollegeFacility, { foreignKey: "college_id", as: "facility" });

export default CollegeFacility;
