export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("college_member", "image_url", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("college_member", "image_url");
    },
};
