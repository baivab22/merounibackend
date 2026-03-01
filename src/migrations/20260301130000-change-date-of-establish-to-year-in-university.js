'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('university');
  const column = tableInfo.date_of_establish;

  if (!column) return;

  // Add new year column
  await queryInterface.addColumn('university', 'date_of_establish_year', {
    type: Sequelize.INTEGER,
    allowNull: true,
  });

  // Migrate existing DATE values to year (MySQL)
  await queryInterface.sequelize.query(
    `UPDATE university SET date_of_establish_year = YEAR(date_of_establish) WHERE date_of_establish IS NOT NULL`
  );

  // Remove old DATE column
  await queryInterface.removeColumn('university', 'date_of_establish');

  // Rename year column to date_of_establish
  await queryInterface.renameColumn(
    'university',
    'date_of_establish_year',
    'date_of_establish'
  );
}

export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('university');
  const column = tableInfo.date_of_establish;

  if (!column) return;

  // Add temp DATE column
  await queryInterface.addColumn('university', 'date_of_establish_date', {
    type: Sequelize.DATE,
    allowNull: true,
  });

  // Convert year back to date (use Jan 1st)
  await queryInterface.sequelize.query(
    `UPDATE university SET date_of_establish_date = STR_TO_DATE(CONCAT(date_of_establish, '-01-01'), '%Y-%m-%d') WHERE date_of_establish IS NOT NULL`
  );

  // Rename year column to temp, add DATE column with original name
  await queryInterface.renameColumn(
    'university',
    'date_of_establish',
    'date_of_establish_year'
  );
  await queryInterface.renameColumn(
    'university',
    'date_of_establish_date',
    'date_of_establish'
  );
  await queryInterface.removeColumn('university', 'date_of_establish_year');
}
