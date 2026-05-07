'use strict'

/** Allow banners without a title (optional title column). */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('banners', 'title', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('banners', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },
}
