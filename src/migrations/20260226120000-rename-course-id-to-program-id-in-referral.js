
export async function up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('referral', 'course_id', 'program_id');
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('referral', 'program_id', 'course_id');
}
