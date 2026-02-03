export default {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("degrees");
        if (!tableInfo.short_name) {
            await queryInterface.addColumn("degrees", "short_name", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },

    async down(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("degrees");
        if (tableInfo.short_name) {
            await queryInterface.removeColumn("degrees", "short_name");
        }
    },
};
