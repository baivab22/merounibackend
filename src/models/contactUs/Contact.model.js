import { DataTypes, Model } from "sequelize";

import { sequelize } from "../../config/database.config.js";

class ContactUs extends Model {}

ContactUs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "unread",
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "contact_us",
    tableName: "contact_us",
    freezeTableName: true,
  }
);

export default ContactUs;
