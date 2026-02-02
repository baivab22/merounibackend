/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('disciplines', 'status');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('disciplines', 'status', {
    type: Sequelize.ENUM('active', 'inactive'),
    defaultValue: 'active',
    allowNull: false,
  });
}
