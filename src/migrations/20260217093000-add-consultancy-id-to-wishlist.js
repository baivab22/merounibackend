'use strict';

export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('wishlist', 'consultancy_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'consultancies',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Make college_id nullable since an item can be either college OR consultancy
    await queryInterface.changeColumn('wishlist', 'college_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  } ,

 async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('wishlist', 'consultancy_id');
    // Revert college_id to not null (caution: this might fail if there are rows with null college_id)
    // For safety in down migration, we might skip making it not-null or handle data cleanup first.
    // Here we just revert the column structure if possible/safe.
    // await queryInterface.changeColumn('wishlist', 'college_id', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false
    // });
  }
};
