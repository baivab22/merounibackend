export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("consultancy_applications", "agent_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "mu_users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("consultancy_applications", "agent_id");
    },
};
