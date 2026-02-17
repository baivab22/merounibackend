import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";

class CollegeMember extends Model {}

CollegeMember.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING, allowNull: true },
    contact_number: { type: DataTypes.STRING },
    role: {
      type: DataTypes.ENUM(
        "Principal",
        "Professor",
        "Lecturer",
        "Admin",
        "Staff"
      ),
      allowNull: true,
    },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: "college_member", timestamps: false }
);

College.hasMany(CollegeMember, { foreignKey: "college_id", as: "members" });
CollegeMember.belongsTo(College, { foreignKey: "college_id" });

export default CollegeMember;
