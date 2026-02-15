/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const table = await queryInterface.describeTable('courses');

  if (table.credits) {
    await queryInterface.changeColumn('courses', 'credits', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }

  if (table.facultyId) {
    await queryInterface.changeColumn('courses', 'facultyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'faculty',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  }
}

export async function down(queryInterface, Sequelize) {
  // Not reverting to allowNull: false to avoid issues with data already in the database
}
