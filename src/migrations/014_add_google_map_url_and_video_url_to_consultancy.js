import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn("consultancies", "google_map_url", {
    type: DataTypes.TEXT,
    allowNull: true,
  });
  await queryInterface.addColumn("consultancies", "video_url", {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("consultancies", "google_map_url");
  await queryInterface.removeColumn("consultancies", "video_url");
}
