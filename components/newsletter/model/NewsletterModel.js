import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

class NewsLetter extends Model {}

NewsLetter.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "draft",
    },
  },
  {
    sequelize,
    modelName: "newsletter",
    tableName: "newsletter",
  }
);

export default NewsLetter;
