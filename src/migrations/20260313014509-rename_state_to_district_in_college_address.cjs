'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('college_addresses', 'state', 'district');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('college_address', 'district', 'state');
  }
};
