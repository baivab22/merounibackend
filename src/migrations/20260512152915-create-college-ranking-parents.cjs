"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("college_ranking_parents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      degree_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "degrees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      degree_list_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
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

    const [results] = await queryInterface.sequelize.query(
      `SELECT degree_id, MAX(description) as description, MAX(content) as content, MAX(degree_list_order) as degree_list_order 
       FROM college_rankings 
       GROUP BY degree_id;`,
    );

    if (results.length > 0) {
      for (const row of results) {
        // Fetch degree slug to use as initial slug for parent
        const [degreeResults] = await queryInterface.sequelize.query(
          `SELECT slug FROM degrees WHERE id = ${row.degree_id} LIMIT 1;`,
        );
        const degreeSlug = degreeResults[0]?.slug || null;

        await queryInterface.sequelize.query(
          `INSERT INTO college_ranking_parents (degree_id, description, content, degree_list_order, slug, createdAt, updatedAt) 
           VALUES (${row.degree_id}, ${queryInterface.sequelize.escape(row.description)}, ${queryInterface.sequelize.escape(row.content)}, ${row.degree_list_order || "NULL"}, ${queryInterface.sequelize.escape(degreeSlug)}, NOW(), NOW());`,
        );
      }
    }

    await queryInterface.removeColumn("college_rankings", "description");
    await queryInterface.removeColumn("college_rankings", "content");
    await queryInterface.removeColumn("college_rankings", "degree_list_order");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("college_rankings", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("college_rankings", "content", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("college_rankings", "degree_list_order", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    const [results] = await queryInterface.sequelize.query(
      `SELECT degree_id, description, content, degree_list_order FROM college_ranking_parents;`,
    );
    for (const row of results) {
      await queryInterface.sequelize.query(
        `UPDATE college_rankings SET 
         description = ${queryInterface.sequelize.escape(row.description)}, 
         content = ${queryInterface.sequelize.escape(row.content)},
         degree_list_order = ${row.degree_list_order || "NULL"}
         WHERE degree_id = ${row.degree_id};`,
      );
    }

    await queryInterface.dropTable("college_ranking_parents");
  },
};
