import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    await queryInterface.removeColumn("news", "reactions");
}

export async function down(queryInterface) {
    await queryInterface.addColumn("news", "reactions", {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
    });
}
