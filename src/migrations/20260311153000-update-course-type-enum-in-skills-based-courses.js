export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('skills_based_courses', 'course_type', {
    type: Sequelize.ENUM("online", "offline", "both"),
    allowNull: true,
    defaultValue: "offline",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('skills_based_courses', 'course_type', {
    type: Sequelize.ENUM("online", "offline"),
    allowNull: true,
    defaultValue: "offline",
  });
}
