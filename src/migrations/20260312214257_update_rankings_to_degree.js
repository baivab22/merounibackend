import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // Clear existing rankings as per implementation plan (switching from programs to degrees)
  await queryInterface.bulkDelete("college_rankings", null, {});

  // Add degree_id column
  await queryInterface.addColumn("college_rankings", "degree_id", {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "degrees",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  // Add description column
  await queryInterface.addColumn("college_rankings", "description", {
    type: DataTypes.TEXT,
    allowNull: true,
  });

  // Remove indices that use program_id
  // Note: The index names might vary slightly depending on how Sequelize was run, 
  // but they were explicitly named in the creation migration.
  try {
    await queryInterface.removeIndex("college_rankings", "unique_program_college");
  } catch (err) {
    console.log("Index unique_program_college not found, skipping removal");
  }
  
  try {
    await queryInterface.removeIndex("college_rankings", "idx_program_rank");
  } catch (err) {
    console.log("Index idx_program_rank not found, skipping removal");
  }

  // Remove program_id
  await queryInterface.removeColumn("college_rankings", "program_id");

  // Add new indices for degree_id
  await queryInterface.addIndex(
    "college_rankings",
    ["degree_id", "college_id"],
    {
      unique: true,
      name: "unique_degree_college",
    }
  );

  await queryInterface.addIndex("college_rankings", ["degree_id", "rank"], {
    name: "idx_degree_rank",
  });
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("college_rankings", null, {});

  await queryInterface.addColumn("college_rankings", "program_id", {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "programs",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  await queryInterface.removeIndex("college_rankings", "unique_degree_college");
  await queryInterface.removeIndex("college_rankings", "idx_degree_rank");

  await queryInterface.removeColumn("college_rankings", "degree_id");
  await queryInterface.removeColumn("college_rankings", "description");

  await queryInterface.addIndex(
    "college_rankings",
    ["program_id", "college_id"],
    {
      unique: true,
      name: "unique_program_college",
    }
  );

  await queryInterface.addIndex("college_rankings", ["program_id", "rank"], {
    name: "idx_program_rank",
  });
}
