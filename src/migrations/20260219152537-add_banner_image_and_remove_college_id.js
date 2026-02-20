'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn("banners", "banner_image", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
    await queryInterface.addColumn("banners", "is_featured", {
      type: Sequelize.TINYINT,
      allowNull: true,
      defaultValue: 0,
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("banners", "banner_image");
    
  },
};
