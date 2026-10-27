"use strict";

const DEFAULT_LEVELS = ["PLUS2", "BACHELORS", "GRADUATE"];

module.exports = {
  async up(queryInterface) {
    const [options] = await queryInterface.sequelize.query(
      "SELECT id, metadata FROM membership_options WHERE type = 'CAREER_FIELD'"
    );

    await Promise.all(
      options.map((option) => {
        let metadata = {};
        try {
          metadata = option.metadata ? JSON.parse(option.metadata) : {};
        } catch {
          metadata = {};
        }

        if (Array.isArray(metadata.associated_levels)) return null;

        return queryInterface.bulkUpdate(
          "membership_options",
          {
            metadata: JSON.stringify({
              ...metadata,
              associated_levels: DEFAULT_LEVELS,
            }),
            updatedAt: new Date(),
          },
          { id: option.id }
        );
      })
    );
  },

  async down(queryInterface) {
    const [options] = await queryInterface.sequelize.query(
      "SELECT id, metadata FROM membership_options WHERE type = 'CAREER_FIELD'"
    );

    await Promise.all(
      options.map((option) => {
        let metadata = {};
        try {
          metadata = option.metadata ? JSON.parse(option.metadata) : {};
        } catch {
          return null;
        }

        if (!Array.isArray(metadata.associated_levels)) return null;

        delete metadata.associated_levels;

        return queryInterface.bulkUpdate(
          "membership_options",
          {
            metadata: JSON.stringify(metadata),
            updatedAt: new Date(),
          },
          { id: option.id }
        );
      })
    );
  },
};
