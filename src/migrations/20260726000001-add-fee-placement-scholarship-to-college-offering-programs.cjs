'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'college_offering_programs';

    await queryInterface.addColumn(tableName, 'fee', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'placement', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'scholarship', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'college_offering_programs';

    await queryInterface.removeColumn(tableName, 'scholarship');
    await queryInterface.removeColumn(tableName, 'placement');
    await queryInterface.removeColumn(tableName, 'fee');
  }
};
