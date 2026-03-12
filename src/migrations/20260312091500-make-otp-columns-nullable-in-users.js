export async function up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("mu_users", "otp", {
        type: Sequelize.STRING,
        allowNull: true,
    });
    await queryInterface.changeColumn("mu_users", "otp_expiry_time", {
        type: Sequelize.DATE,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("mu_users", "otp", {
        type: Sequelize.STRING,
        allowNull: false,
    });
    await queryInterface.changeColumn("mu_users", "otp_expiry_time", {
        type: Sequelize.DATE,
        allowNull: false,
    });
}
