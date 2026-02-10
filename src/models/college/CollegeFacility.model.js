import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";

class CollegeFacility extends Model { }

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
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "college_facility",
    timestamps: false,
    freezeTableName: true,
  }
);


export default CollegeFacility;
