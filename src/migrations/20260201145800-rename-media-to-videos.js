"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("media", "videos");
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("videos", "media");
    },
};
