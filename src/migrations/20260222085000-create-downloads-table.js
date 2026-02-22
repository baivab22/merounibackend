import { DataTypes } from "sequelize";
import Sequelize from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    await queryInterface.createTable("downloads", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        download_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reference_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "mu_users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_agent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
        },
    });
}

export async function down(queryInterface) {
    await queryInterface.dropTable("downloads");
}
