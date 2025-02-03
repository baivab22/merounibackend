import { DataTypes } from "sequelize";

import { sequelize } from "../../../config/database.js";
import User from "../../users/model/UserModel.js";
import College from "../../college/models/CollegeModel.js";

const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: College,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    freezedTableName: true,
    tableName: "wishlist",
  }
);

User.hasMany(Wishlist, { foreignKey: "user_id" });
College.hasMany(Wishlist, { foreignKey: "college_id" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });
Wishlist.belongsTo(College, { foreignKey: "college_id" });

export default Wishlist;
