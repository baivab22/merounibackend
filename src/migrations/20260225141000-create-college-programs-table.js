'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('college_programs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      college_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'colleges',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      program_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'programs',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      }
    });

    await queryInterface.addIndex(
      'college_programs',
      ['college_id', 'program_id'],
      {
        unique: true,
        name: 'college_programs_unique'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('college_programs');
  }
};