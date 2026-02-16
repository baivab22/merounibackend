'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if column exists first to avoid error if manually added
    const tableInfo = await queryInterface.describeTable('university');
    if (!tableInfo.order_no_for_website) {
      await queryInterface.addColumn('university', 'order_no_for_website', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('university');
    if (tableInfo.order_no_for_website) {
      await queryInterface.removeColumn('university', 'order_no_for_website');
    }
  }
};
