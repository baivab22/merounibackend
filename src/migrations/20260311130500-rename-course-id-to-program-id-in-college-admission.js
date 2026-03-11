export async function up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("college_admissions", "course_id", "program_id");
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("college_admissions", "program_id", "course_id");
}
