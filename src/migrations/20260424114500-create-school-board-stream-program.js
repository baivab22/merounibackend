import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const tables = await queryInterface.showAllTables();

  // 1. Create schools_board_streams_and_programs table
  if (!tables.includes("schools_board_streams_and_programs")) {
    console.log("Creating schools_board_streams_and_programs table...");
    await queryInterface.createTable("schools_board_streams_and_programs", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      college_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "colleges_schools", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "boards", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      stream_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "streams", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      program_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "programs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex(
      "schools_board_streams_and_programs",
      ["college_id", "board_id", "stream_id", "program_id"],
      {
        unique: true,
        name: "idx_school_board_stream_program_unique",
      },
    );
  }

  // 2. Drop obsolete tables
  if (tables.includes("college_boards")) {
    console.log("Dropping obsolete college_boards table...");
    await queryInterface.dropTable("college_boards");
  }
  if (tables.includes("college_streams")) {
    console.log("Dropping obsolete college_streams table...");
    await queryInterface.dropTable("college_streams");
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("schools_board_streams_and_programs");
}
