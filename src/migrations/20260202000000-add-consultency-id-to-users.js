
import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    await queryInterface.addColumn('mu_users', 'consultency_id', {
        type: DataTypes.INTEGER,
        allowNull: true,
    });
}

export async function down(queryInterface) {
    await queryInterface.removeColumn('mu_users', 'consultency_id');
}
