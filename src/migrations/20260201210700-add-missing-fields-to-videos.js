export default {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("videos");

        // Add slug column only if it doesn't exist
        if (!tableInfo.slug) {
            await queryInterface.addColumn("videos", "slug", {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                defaultValue: "", // Temporary default, you'll need to update existing rows
            });
        }

        // Add description column only if it doesn't exist
        if (!tableInfo.description) {
            await queryInterface.addColumn("videos", "description", {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }

        // Add status column only if it doesn't exist
        if (!tableInfo.status) {
            await queryInterface.addColumn("videos", "status", {
                type: Sequelize.ENUM("active", "inactive"),
                defaultValue: "active",
                allowNull: false,
            });
        }
    },

    async down(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("videos");

        if (tableInfo.slug) {
            await queryInterface.removeColumn("videos", "slug");
        }
        if (tableInfo.description) {
            await queryInterface.removeColumn("videos", "description");
        }
        if (tableInfo.status) {
            await queryInterface.removeColumn("videos", "status");
        }
    },
};
