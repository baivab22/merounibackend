import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class SearchTerm extends Model {}

SearchTerm.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    term: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SearchTerm",
    tableName: "search_terms",
    timestamps: true,
  }
);

export default SearchTerm;
