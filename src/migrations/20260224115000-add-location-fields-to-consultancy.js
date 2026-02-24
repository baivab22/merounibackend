'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Add structured address columns to consultancies table
    await queryInterface.addColumn("consultancies", "city", {
        type: Sequelize.STRING,
        allowNull: true,
    });
    await queryInterface.addColumn("consultancies", "state", {
        type: Sequelize.STRING,
        allowNull: true,
    });
    await queryInterface.addColumn("consultancies", "street", {
        type: Sequelize.STRING,
        allowNull: true,
    });
    await queryInterface.addColumn("consultancies", "country", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    // Also add a 'location' field as a summary string if needed (often used for quick display)
    await queryInterface.addColumn("consultancies", "location", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    // Ensure 'destination' and 'address' (JSON) are nullable if they weren't
    await queryInterface.changeColumn("consultancies", "destination", {
        type: Sequelize.JSON,
        allowNull: true,
    });
    await queryInterface.changeColumn("consultancies", "address", {
        type: Sequelize.JSON,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("consultancies", "city");
    await queryInterface.removeColumn("consultancies", "state");
    await queryInterface.removeColumn("consultancies", "street");
    await queryInterface.removeColumn("consultancies", "country");
    await queryInterface.removeColumn("consultancies", "location");
}
