export default {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("videos");
        if (tableInfo.status) {
            await queryInterface.removeColumn("videos", "status");
        }
    },

    async down(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("videos");
        if (!tableInfo.status) {
            await queryInterface.addColumn("videos", "status", {
                type: Sequelize.ENUM("active", "inactive"),
                defaultValue: "active",
                allowNull: false,
            });
        }
    },
};
