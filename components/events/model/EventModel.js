import { DataTypes } from "sequelize";
import { sequelize } from ".././../../config/database.js";

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slugs: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "colleges",
        key: "id",
      },
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mu_users",
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "events",
    freezeTableName: true,
    timestamps: true,
  }
);

// Event.belongsTo(Category, { foreignKey: "category_id", as: "category" });
// Event.belongsTo(College, { foreignKey: "college_id", as: "college" });
// Event.belongsTo(User, { foreignKey: "author_id", as: "author" });

export default Event;
