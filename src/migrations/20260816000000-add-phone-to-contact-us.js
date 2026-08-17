export default {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("contact_us");
    if (!tableInfo.phone) {
      await queryInterface.addColumn("contact_us", "phone", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable("contact_us");
    if (tableInfo.phone) {
      await queryInterface.removeColumn("contact_us", "phone");
    }
  },
};
