export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn("exams", "category_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: "categories",
            key: "id",
        },
        onDelete: "SET NULL",
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("exams", "category_id");
}
