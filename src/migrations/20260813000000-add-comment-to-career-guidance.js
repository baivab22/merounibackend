export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('career_guidance', 'comment', {
    type: Sequelize.TEXT,
    allowNull: true
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('career_guidance', 'comment');
}
