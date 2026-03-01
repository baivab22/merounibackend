'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const [results] = await queryInterface.sequelize.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'college_admission' 
     AND COLUMN_NAME IN ('course_id', 'program_id')`
  );

  const columns = results.map((r) => r.COLUMN_NAME);
  const hasCourseId = columns.includes('course_id');
  const hasProgramId = columns.includes('program_id');

  if (hasProgramId && !hasCourseId) {
    await queryInterface.renameColumn(
      'college_admission',
      'program_id',
      'course_id'
    );
  }
}

export async function down(queryInterface) {
  const [results] = await queryInterface.sequelize.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'college_admission' 
     AND COLUMN_NAME IN ('course_id', 'program_id')`
  );

  const columns = results.map((r) => r.COLUMN_NAME);
  const hasCourseId = columns.includes('course_id');
  const hasProgramId = columns.includes('program_id');

  if (hasCourseId && !hasProgramId) {
    await queryInterface.renameColumn(
      'college_admission',
      'course_id',
      'program_id'
    );
  }
}
