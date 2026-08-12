export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("career_guidance", "email", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("career_guidance", "email", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
