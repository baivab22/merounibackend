'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('stream_programs').catch(() => null);
    
    if (!tableInfo) {
      await queryInterface.createTable('stream_programs', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        stream_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'streams',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        program_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'programs',
            key: 'id'
          },
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
    }

    try {
      await queryInterface.addIndex('stream_programs', ['stream_id', 'program_id'], {
        unique: true,
        name: 'unique_stream_program_index'
      });
    } catch (e) {
      if (e.name !== 'SequelizeDatabaseError' || !e.message.includes('Duplicate key name')) {
        throw e;
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stream_programs');
  }
};
