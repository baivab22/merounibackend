/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Update college_facility table
  const facilityTable = await queryInterface.describeTable('college_facility');
  
  if (facilityTable.title) {
    await queryInterface.changeColumn('college_facility', 'title', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
  
  if (facilityTable.description) {
    await queryInterface.changeColumn('college_facility', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  }
  
  if (facilityTable.icon) {
    await queryInterface.changeColumn('college_facility', 'icon', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }

  // Update college_members table
  const membersTable = await queryInterface.describeTable('college_members');
  
  if (membersTable.name) {
    await queryInterface.changeColumn('college_members', 'name', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
  
  if (membersTable.role) {
    await queryInterface.changeColumn('college_members', 'role', {
      type: Sequelize.ENUM('Principal', 'Professor', 'Lecturer', 'Admin', 'Staff'),
      allowNull: true
    });
  }
}

export async function down(queryInterface, Sequelize) {
  // Reverting to allowNull: false might fail if there are already null values in the database.
  // For safety, we typically don't revert to strictly NOT NULL in the down migration 
  // unless we're sure no null data was introduced.
}
