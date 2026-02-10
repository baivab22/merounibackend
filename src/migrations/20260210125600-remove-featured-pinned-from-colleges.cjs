'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('colleges', 'is_featured');
    await queryInterface.removeColumn('colleges', 'pinned');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('colleges', 'is_featured', {
      type: Sequelize.TINYINT,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('colleges', 'pinned', {
      type: Sequelize.TINYINT,
      allowNull: true,
      defaultValue: 0,
    });
  }
};
