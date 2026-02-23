/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    await queryInterface.renameColumn("news", "featuredImage", "featured_image");
}

export async function down(queryInterface) {
    await queryInterface.renameColumn("news", "featured_image", "featuredImage");
}
