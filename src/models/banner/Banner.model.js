import { DataTypes } from "sequelize";

import { sequelize } from "../../config/database.config.js";

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
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    banner_image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    display_position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_featured: {
      type: DataTypes.TINYINT,
      allowNull: true,
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

export default Banner;
