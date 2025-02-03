import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

class College extends Model {}

College.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    institute_type: {
      type: DataTypes.ENUM("Public", "Private", "Community", "Technical"),
      allowNull: false,
    },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
    university_id: { type: DataTypes.INTEGER, allowNull: false },
    google_map_url: { type: DataTypes.STRING },
  },
  { sequelize, modelName: "college", timestamps: true }
);

export default College;
