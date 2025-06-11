import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";
import College from "./CollegeModel.js";

class CollegeGallery extends Model {}

CollegeGallery.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      references: {
        model: College,
        key: "id",
      },
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "college_gallery",
    timestamps: false,
    freezeTableName: true,
  }
);

export default CollegeGallery;
