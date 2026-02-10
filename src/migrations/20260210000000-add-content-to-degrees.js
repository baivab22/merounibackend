export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('degrees', 'content', {
    type: Sequelize.TEXT,
    allowNull: true,
    after: 'description'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('degrees', 'content');
}
