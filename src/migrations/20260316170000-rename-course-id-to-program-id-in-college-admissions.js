export async function up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("college_admissions");
    if (tableInfo.course_id && !tableInfo.program_id) {
        await queryInterface.renameColumn("college_admissions", "course_id", "program_id");
    }
}

export async function down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("college_admissions");
    if (tableInfo.program_id && !tableInfo.course_id) {
        await queryInterface.renameColumn("college_admissions", "program_id", "course_id");
    }
}
