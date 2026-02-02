export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("programs", "discipline_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "disciplines",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("programs", "discipline_id");
    },
};  
