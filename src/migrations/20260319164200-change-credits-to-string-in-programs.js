import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const tableDescription = await queryInterface.describeTable("programs");
    if (tableDescription.credits) {
        await queryInterface.changeColumn("programs", "credits", {
            type: DataTypes.STRING(255),
            allowNull: true,
        });
    }
}

export async function down(queryInterface) {
    const tableDescription = await queryInterface.describeTable("programs");
    if (tableDescription.credits) {
        await queryInterface.changeColumn("programs", "credits", {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        });
    }
}
