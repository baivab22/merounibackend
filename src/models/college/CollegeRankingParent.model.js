import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class CollegeRankingParent extends Model {}

CollegeRankingParent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    degree_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "degrees",
        key: "id",
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    degree_list_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "college_ranking_parents",
    tableName: "college_ranking_parents",
    timestamps: true,
  },
);

export default CollegeRankingParent;
