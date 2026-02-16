'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('blogs', 'featuredImage', 'featured_image');
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('blogs', 'featured_image', 'featuredImage');
}
