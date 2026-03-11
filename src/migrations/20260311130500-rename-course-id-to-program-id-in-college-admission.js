export async function up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("college_admission", "course_id", "program_id");
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("college_admission", "program_id", "course_id");
}
