import { DataTypes } from "sequelize";
import Sequelize from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.createTable("degrees", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    short_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("degrees");
}
