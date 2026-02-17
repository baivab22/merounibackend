export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("mu_users", "profile_image_url", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn("mu_users", "cv_url", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("mu_users", "profile_image_url");
        await queryInterface.removeColumn("mu_users", "cv_url");
    },
};
