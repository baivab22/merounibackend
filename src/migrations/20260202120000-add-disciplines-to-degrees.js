/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('degrees', 'disciplines', {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: []
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('degrees', 'disciplines');
}
