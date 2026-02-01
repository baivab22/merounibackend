"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("programs", "discipline_id");
    },
};
