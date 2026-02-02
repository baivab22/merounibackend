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
            console.log("Index might already exist or error occurred:", error.message);
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex("configs", "configs_type_unique_idx");
    },
};
