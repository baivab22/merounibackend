/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable("media");

  if (!tableInfo.media_type) {
    await queryInterface.addColumn("media", "media_type", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "general",
    });
  }

  if (!tableInfo.media_url) {
    await queryInterface.addColumn("media", "media_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
}

export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable("media");

  if (tableInfo.media_type) {
    await queryInterface.removeColumn("media", "media_type");
  }

  if (tableInfo.media_url) {
    await queryInterface.removeColumn("media", "media_url");
  }
}
