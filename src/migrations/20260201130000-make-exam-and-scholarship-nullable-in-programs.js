import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.changeColumn("programs", "exam_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await queryInterface.changeColumn("programs", "scholarship_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.changeColumn("programs", "exam_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await queryInterface.changeColumn("programs", "scholarship_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
}




