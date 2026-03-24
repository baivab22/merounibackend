'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('consultancies', 'state', 'district');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('consultancies', 'district', 'state');
  }
};
