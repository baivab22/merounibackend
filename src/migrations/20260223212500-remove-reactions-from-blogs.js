
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("blogs", "reactions");
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.addColumn("blogs", "reactions", {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
    });
}
