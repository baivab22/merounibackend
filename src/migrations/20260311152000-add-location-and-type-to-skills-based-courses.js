export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('skills_based_courses', 'location', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  // We will use Sequelize.STRING for enum back-compatibility in the DB, or ENUM if it's already there. Better to use Sequelize.ENUM if that's what we did.
  await queryInterface.addColumn('skills_based_courses', 'course_type', {
    type: Sequelize.ENUM("online", "offline"),
    allowNull: true,
    defaultValue: "offline",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('skills_based_courses', 'location');
  await queryInterface.removeColumn('skills_based_courses', 'course_type');
}
