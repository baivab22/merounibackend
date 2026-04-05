'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('college_streams', {
      college_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'colleges',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      stream_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'streams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('college_streams', {
      fields: ['college_id', 'stream_id'],
      type: 'primary key'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('college_streams');
  }
};
