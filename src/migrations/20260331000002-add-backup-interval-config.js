export default {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("configs", [
      {
        type: "database_backup_interval",
        value: "Weekly",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("configs", {
      type: "database_backup_interval",
    });
  },
};
