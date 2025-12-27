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
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "programs",
        key: "id",
      },
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "colleges",
        key: "id",
      },
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    program_list_order: {
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
        fields: ["program_id", "college_id"],
        name: "unique_program_college",
      },
      {
        fields: ["program_id", "rank"],
      },
      {
        fields: ["program_list_order"],
      },
    ],
  }
);

export default CollegeRanking;
