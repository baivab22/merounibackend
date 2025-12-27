import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // Create material_categories table
  await queryInterface.createTable("material_categories", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Add category_id to materials table
  await queryInterface.addColumn("materials", "category_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "material_categories",
      key: "id",
    },
    onDelete: "SET NULL",
  });
}

export async function down(queryInterface) {
  // Remove category_id from materials table
  await queryInterface.removeColumn("materials", "category_id");

  // Drop material_categories table
  await queryInterface.dropTable("material_categories");
}
