'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Add columns to 'exams' table
    await queryInterface.addColumn('exams', 'exam_type', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('exams', 'full_marks', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('exams', 'pass_marks', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('exams', 'questions_count', { // renamed from number_of_question for clarity, or keep same? details had 'number_of_question'
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('exams', 'question_type', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('exams', 'duration', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('exams', 'normal_fee', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('exams', 'late_fee', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('exams', 'exam_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('exams', 'opening_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('exams', 'closing_date', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Optional: We might want to migrate data from details tables to exams table here if we wanted to preserve data.
    // Given the user asked for a clean form/migration, I assume it's okay to start fresh or they will handle data.
    // However, keeping old tables for now or dropping them?
    // User said "create migration", usually implies modifying structure. 
    // I will leave old tables for now in DB but ignore in model, or user might want to drop them. 
    // Safest is just add columns.
  },

  async  down(queryInterface, Sequelize){
    await queryInterface.removeColumn('exams', 'exam_type');
    await queryInterface.removeColumn('exams', 'full_marks');
    await queryInterface.removeColumn('exams', 'pass_marks');
    await queryInterface.removeColumn('exams', 'questions_count');
    await queryInterface.removeColumn('exams', 'question_type');
    await queryInterface.removeColumn('exams', 'duration');
    await queryInterface.removeColumn('exams', 'normal_fee');
    await queryInterface.removeColumn('exams', 'late_fee');
    await queryInterface.removeColumn('exams', 'exam_date');
    await queryInterface.removeColumn('exams', 'opening_date');
    await queryInterface.removeColumn('exams', 'closing_date');
  }
};
