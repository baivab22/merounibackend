import { DataTypes } from "sequelize";

import { sequelize } from "../../../config/database.js";
import College from "../../college/models/CollegeModel.js";

const Banner = sequelize.define(
  "Banner",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "https://merouni.com"
    },
  },
  {
    tableName: "banners",
    freezeTableName: true,
    timestamps: true,
  }
);

Banner.belongsTo(College, { foreignKey: "college_id", onDelete: "CASCADE" });
College.hasMany(Banner, { foreignKey: "college_id" });

export default Banner;
