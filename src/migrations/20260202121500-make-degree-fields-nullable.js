/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tableDefinition = await queryInterface.describeTable('degrees');

  // Handle description
  if (tableDefinition.description) {
    await queryInterface.changeColumn('degrees', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  } else {
    await queryInterface.addColumn('degrees', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  }

  // Handle featured_image
  if (tableDefinition.featured_image) {
    await queryInterface.changeColumn('degrees', 'featured_image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  } else {
    await queryInterface.addColumn('degrees', 'featured_image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
}

export async function down(queryInterface, Sequelize) {
    // We strictly revert the nullable change if columns exist
    const tableDefinition = await queryInterface.describeTable('degrees');

    if (tableDefinition.description) {
        // Attempt to revert to not null, but this might fail if data is null
        // leaving as is for safety in this specific "down" scenario or commenting out
        // await queryInterface.changeColumn('degrees', 'description', {
        //   type: Sequelize.TEXT,
        //   allowNull: false
        // });
    }
    
    // If we added them, we should technically remove them, but we don't know if we added or changed.
    // Ideally, we wouldn't remove columns in down if they might have existed before.
}
