export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("career_application", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        career_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "career",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "mu_users",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        resume: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        cover_letter: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM("pending", "reviewed", "rejected", "hired"),
            allowNull: false,
            defaultValue: "pending",
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable("career_application");
}
