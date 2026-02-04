import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    await queryInterface.addColumn('university', 'logo', {
        type: DataTypes.STRING,
        allowNull: true,
    });
}

export async function down(queryInterface) {
    await queryInterface.removeColumn('university', 'logo');
}
