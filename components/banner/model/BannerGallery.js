import { DataTypes } from "sequelize";

import { sequelize } from "../../../config/database.js";
import Banner from "../model/BannerModel.js";

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
