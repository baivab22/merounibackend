export async function up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("exams", "affiliation", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: "university",
            key: "id",
        },
        onDelete: "CASCADE",
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("exams", "affiliation", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "university",
            key: "id",
        },
        onDelete: "CASCADE",
    });
}
