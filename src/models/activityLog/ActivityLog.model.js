import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import UserModel from "../users/User.model.js";

class ActivityLogModel extends Model {}

ActivityLogModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "activity_logs",
    freezeTableName: true,
    timestamps: true,
  }
);

// Define associations
ActivityLogModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });
UserModel.hasMany(ActivityLogModel, { foreignKey: "user_id", as: "activityLogs" });

export default ActivityLogModel;
