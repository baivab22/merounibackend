import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";
import College from "./CollegeModel.js";

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
    name: { type: DataTypes.STRING, allowNull: false },
    contact_number: { type: DataTypes.STRING },
    role: {
      type: DataTypes.ENUM("Principal", "Professor", "Lecturer", "Admin", "Staff"),
      allowNull: false,
    },
    description: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "college_member", timestamps: false }
);

College.hasMany(CollegeMember, { foreignKey: "college_id", as: "members" });
CollegeMember.belongsTo(College, { foreignKey: "college_id" });

export default CollegeMember;
