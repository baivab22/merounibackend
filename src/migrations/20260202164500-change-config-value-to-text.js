export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("configs", "value", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("configs", "value", {
            type: Sequelize.STRING(500),
            allowNull: true,
        });
    },
};
