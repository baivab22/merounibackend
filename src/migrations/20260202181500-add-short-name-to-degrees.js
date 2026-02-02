export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("degrees", "short_name", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("degrees", "short_name");
    },
};
