export async function up(queryInterface, Sequelize) {
  const tables = ['exams', 'university', 'consultancies', 'events', 'news'];
  for (const table of tables) {
    await queryInterface.addColumn(table, 'meta_description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  }
}

export async function down(queryInterface, Sequelize) {
  const tables = ['exams', 'university', 'consultancies', 'events', 'news'];
  for (const table of tables) {
    await queryInterface.removeColumn(table, 'meta_description');
  }
}
