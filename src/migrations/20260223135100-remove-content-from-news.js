import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    await queryInterface.removeColumn("news", "content");
}

export async function down(queryInterface) {
    await queryInterface.addColumn("news", "content", {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    });
}
