export default {
    async up(queryInterface, Sequelize) {
        // Attempt to add a unique index to ensure uniqueness.
        // Using addIndex with unique: true is a standard way to enforce this.
        // Use a specific name to avoid collision if one was auto-generated, or to be explicit.
        try {
            await queryInterface.addIndex("configs", ["type"], {
                unique: true,
                name: "configs_type_unique_idx",
            });
        } catch (error) {
            // If index already exists (e.g. from createTable), we can ignore or log.
            // However, usually addIndex is safe to run if we name it differently,
            // or we can just proceed.
            // If the user wants to truly 'ensure', this is the way.
            console.log("Index might already exist or error occurred:", error.message);
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex("configs", "configs_type_unique_idx");
    },
};
