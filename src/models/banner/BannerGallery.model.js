import { DataTypes } from "sequelize";

import { sequelize } from "../../config/database.config.js";
import Banner from "./Banner.model.js";

const BannerGallery = sequelize.define(
  "banner_gallery",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    banner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: {
      type: DataTypes.ENUM("small", "medium", "large"),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_featured: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: "banner_gallery",
    timestamps: false,
  }
);

BannerGallery.belongsTo(Banner, {
  foreignKey: "banner_id",
  onDelete: "CASCADE",
});
Banner.hasMany(BannerGallery, { foreignKey: "banner_id" });

export default BannerGallery;
