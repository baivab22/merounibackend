import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";
import College from "../../college/models/CollegeModel.js";
import User from "../../users/model/UserModel.js";

class Referral extends Model {}

Referral.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: College,
        key: "id",
      },
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    application_type: {
      type: DataTypes.ENUM("self", "referred"),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    modelName: "referral",
  }
);

export default Referral;
