export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("consultancy_applications", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            consultancy_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "consultancies",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            student_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "mu_users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            student_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            student_phone_no: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            student_email: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            student_description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM("IN_PROGRESS", "ACCEPTED", "REJECTED"),
                allowNull: false,
                defaultValue: "IN_PROGRESS",
            },
            remarks: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("consultancy_applications");
    },
};
