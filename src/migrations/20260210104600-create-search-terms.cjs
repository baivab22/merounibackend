'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('search_terms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      term: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
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

    // Add index on term for faster lookups
    await queryInterface.addIndex('search_terms', ['term']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('search_terms');
  }
};
