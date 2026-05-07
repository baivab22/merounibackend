"use strict";

/** Allow banners without a click-through URL (optional website_url). */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("banners", "website_url", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("banners", "website_url", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "https://merouni.com",
    });
  },
};
