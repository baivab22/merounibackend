module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('skills_based_courses', 'status')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('skills_based_courses', 'status', {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false
    })
  }
}
