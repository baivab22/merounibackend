'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("news", "college_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "colleges",
                key: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("news", "college_id");
    }
};
