'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'university';

    const table = await queryInterface.describeTable(tableName).catch(() => ({}));

    if (!table.qs_ranking) {
      await queryInterface.addColumn(tableName, 'qs_ranking', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!table.the_ranking) {
      await queryInterface.addColumn(tableName, 'the_ranking', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'university';

    const table = await queryInterface.describeTable(tableName).catch(() => ({}));

    if (table.the_ranking) {
      await queryInterface.removeColumn(tableName, 'the_ranking');
    }

    if (table.qs_ranking) {
      await queryInterface.removeColumn(tableName, 'qs_ranking');
    }
  }
};
