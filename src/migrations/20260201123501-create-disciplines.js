"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("disciplines", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            slugs: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            status: {
                type: Sequelize.ENUM("active", "inactive"),
                defaultValue: "active",
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("disciplines");
    },
};
