import { DataTypes, literal } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const tableDescription = await queryInterface.describeTable("college_members");
    if (tableDescription.role) {
        const sequelize = queryInterface.sequelize;
        await sequelize.query(
            "ALTER TABLE `college_members` MODIFY COLUMN `role` VARCHAR(255) NULL"
        );
    }
}

export async function down(queryInterface) {
    const tableDescription = await queryInterface.describeTable("college_members");
    if (tableDescription.role) {
        const sequelize = queryInterface.sequelize;
        await sequelize.query(
            "ALTER TABLE `college_members` MODIFY COLUMN `role` ENUM('Principal','Professor','Lecturer','Admin','Staff') NULL"
        );
    }
}
