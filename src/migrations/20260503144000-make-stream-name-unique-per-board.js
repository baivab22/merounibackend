import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // 1. Remove the existing global unique constraint on 'name'
  // In MySQL/Sequelize, the unique constraint often has the same name as the column
  try {
    await queryInterface.removeIndex("streams", "name");
  } catch (error) {
    console.warn(
      "Could not remove index 'name', it might not exist or have a different name.",
      error.message,
    );
  }

  // 2. Add composite unique constraint on 'name' and 'board_id'
  await queryInterface.addIndex("streams", ["name", "board_id"], {
    unique: true,
    name: "name_board_unique",
  });
}

export async function down(queryInterface) {
  // 1. Remove composite unique constraint
  await queryInterface.removeIndex("streams", "name_board_unique");

  // 2. Restore global unique constraint on 'name'
  await queryInterface.addIndex("streams", ["name"], {
    unique: true,
    name: "name",
  });
}
