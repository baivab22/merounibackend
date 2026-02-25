/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('college_facility');

  if (tableInfo.icon) {
    // Change to TEXT and ensure utf8mb4 for emoji support
    await queryInterface.changeColumn('college_facility', 'icon', {
      type: Sequelize.TEXT('long'), // Using longtext just in case, but TEXT is enough. 
      // Actually Sequelize.TEXT is fine.
      allowNull: true,
    });

    // Manually run SQL to ensure charset is utf8mb4 for this column
    await queryInterface.sequelize.query(
      'ALTER TABLE college_facility MODIFY icon TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'
    );
  }
}

export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('college_facility');

  if (tableInfo.icon) {
    await queryInterface.changeColumn('college_facility', 'icon', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
}
