'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('news');

    if (!tableInfo.college_id) {
      await queryInterface.addColumn('news', 'college_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'colleges_schools',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    if (!tableInfo.school_id) {
      await queryInterface.addColumn('news', 'school_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'colleges_schools',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    if (!tableInfo.consultancy_id) {
      await queryInterface.addColumn('news', 'consultancy_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'consultancies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('news', 'college_id');
    await queryInterface.removeColumn('news', 'school_id');
    await queryInterface.removeColumn('news', 'consultancy_id');
  }
};
