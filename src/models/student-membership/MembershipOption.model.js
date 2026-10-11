import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class MembershipOption extends Model {}

MembershipOption.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("LEVEL", "CAREER_FIELD", "PAYMENT_METHOD"),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "membership_options",
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["type", "slug"],
      },
    ],
  }
);

export default MembershipOption;
