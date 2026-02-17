import { DataTypes } from "sequelize";

import { sequelize } from "../../config/database.config.js";
import User from "../users/User.model.js";
import College from "../college/College.model.js";

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
      allowNull: true,
      references: {
        model: College,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    consultancy_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "consultancies", // Using string based on other models usually, or import Consultancy
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

import Consultancy from "../consultancy/Consultancy.model.js";

User.hasMany(Wishlist, { foreignKey: "user_id" });
College.hasMany(Wishlist, { foreignKey: "college_id" });
Consultancy.hasMany(Wishlist, { foreignKey: "consultancy_id" });

Wishlist.belongsTo(User, { foreignKey: "user_id" });
Wishlist.belongsTo(College, { as: "college", foreignKey: "college_id" });
Wishlist.belongsTo(Consultancy, { as: "consultancy", foreignKey: "consultancy_id" });

export default Wishlist;
