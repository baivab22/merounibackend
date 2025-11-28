import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";

class CollegeContact extends Model {}

CollegeContact.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    contact_number: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "college_contact", timestamps: false }
);

College.hasMany(CollegeContact, { foreignKey: "college_id", as: "contacts" });
CollegeContact.belongsTo(College, { foreignKey: "college_id" });

export default CollegeContact;
