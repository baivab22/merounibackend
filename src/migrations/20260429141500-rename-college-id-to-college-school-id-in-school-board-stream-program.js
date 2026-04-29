
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.renameColumn(
    "schools_board_streams_and_programs",
    "college_id",
    "college_school_id"
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.renameColumn(
    "schools_board_streams_and_programs",
    "college_school_id",
    "college_id"
  );
}
