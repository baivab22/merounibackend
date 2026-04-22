import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  let junctionExists = false;
  try {
    await queryInterface.describeTable("programs_degrees");
    junctionExists = true;
  } catch {
    junctionExists = false;
  }

  if (!junctionExists) {
    await queryInterface.createTable("programs_degrees", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      program_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "programs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      degree_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "degrees", key: "id" },
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

    await queryInterface.addIndex("programs_degrees", ["program_id", "degree_id"], {
      unique: true,
      name: "programs_degrees_program_id_degree_id_unique",
    });
  }

  const programsDesc = await queryInterface.describeTable("programs");
  if (programsDesc.degree_id) {
    await queryInterface.sequelize.query(`
      INSERT IGNORE INTO programs_degrees (program_id, degree_id, createdAt, updatedAt)
      SELECT id, degree_id, NOW(3), NOW(3)
      FROM programs
      WHERE degree_id IS NOT NULL
    `);
    await queryInterface.removeColumn("programs", "degree_id");
  }
}

export async function down(queryInterface, Sequelize) {
  const programsDesc = await queryInterface.describeTable("programs");
  if (!programsDesc.degree_id) {
    await queryInterface.addColumn("programs", "degree_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "degrees", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  }

  let junctionExists = false;
  try {
    await queryInterface.describeTable("programs_degrees");
    junctionExists = true;
  } catch {
    junctionExists = false;
  }

  if (junctionExists) {
    await queryInterface.sequelize.query(`
      UPDATE programs p
      INNER JOIN (
        SELECT program_id, MIN(degree_id) AS degree_id
        FROM programs_degrees
        GROUP BY program_id
      ) pd ON p.id = pd.program_id
      SET p.degree_id = pd.degree_id
    `);
    await queryInterface.dropTable("programs_degrees");
  }
}
