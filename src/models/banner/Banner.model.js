import { DataTypes } from "sequelize";

import { sequelize } from "../../config/database.config.js";
import College from "../college/College.model.js";

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
      defaultValue: "https://merouni.com",
    },
    display_position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    date_of_expiry: {
      type: DataTypes.DATE,
      defaultValue: () => {
        const now = new Date();
        now.setDate(now.getDate() + 30);
        return now;
      },
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
