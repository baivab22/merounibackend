/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("college_rankings", "content", {
    type: Sequelize.TEXT,
    allowNull: true,
    after: "description",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("college_rankings", "content");
}
