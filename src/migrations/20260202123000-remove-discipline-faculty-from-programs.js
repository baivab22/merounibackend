/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('programs');

    if (tableDefinition.discipline_id) {
        await queryInterface.removeColumn('programs', 'discipline_id');
    }

    if (tableDefinition.faculty_id) {
        await queryInterface.removeColumn('programs', 'faculty_id');
    }
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.addColumn('programs', 'discipline_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "disciplines",
        key: "id",
      },
    });

    await queryInterface.addColumn('programs', 'faculty_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
}
