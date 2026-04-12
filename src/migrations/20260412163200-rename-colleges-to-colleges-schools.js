/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.renameTable("colleges", "colleges_schools");
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.renameTable("colleges_schools", "colleges");
}
