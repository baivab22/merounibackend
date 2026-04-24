import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class CollegeRanking extends Model {}

CollegeRanking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    degree_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "degrees",
        key: "id",
      },
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "colleges_schools",
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    degree_list_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "college_rankings",
    tableName: "college_rankings",
    timestamps: true,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["degree_id", "college_id"],
        name: "unique_degree_college",
      },
      {
        fields: ["degree_id", "rank"],
      },
      {
        fields: ["degree_list_order"],
      },
    ],
  },
);

export default CollegeRanking;
