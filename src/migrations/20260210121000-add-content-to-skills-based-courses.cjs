module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('skills_based_courses', 'content', {
      type: Sequelize.TEXT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('skills_based_courses', 'content')
  }
}
