import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // First, find the existing foreign key constraint name
  const [results] = await queryInterface.sequelize.query(
    `SELECT CONSTRAINT_NAME 
     FROM information_schema.KEY_COLUMN_USAGE 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'events' 
     AND COLUMN_NAME = 'college_id' 
     AND REFERENCED_TABLE_NAME IS NOT NULL`
  );

  let constraintName = "events_ibfk_4"; // Default from error message
  if (results && results.length > 0) {
    constraintName = results[0].CONSTRAINT_NAME;
  }

  // Drop the foreign key constraint
  await queryInterface.sequelize.query(
    `ALTER TABLE events DROP FOREIGN KEY ${constraintName}`
  );

  // Now change the column to allow NULL
  await queryInterface.changeColumn("events", "college_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  // Re-add the foreign key constraint with SET NULL
  await queryInterface.addConstraint("events", {
    fields: ["college_id"],
    type: "foreign key",
    name: constraintName, // Use the same constraint name
    references: {
      table: "colleges",
      field: "id",
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
}

export async function down(queryInterface) {
  const constraintName = "events_ibfk_4";

  // Remove the foreign key constraint
  try {
    await queryInterface.removeConstraint("events", constraintName);
  } catch (error) {
    // Constraint might not exist, try dropping via raw SQL
    await queryInterface.sequelize.query(
      `ALTER TABLE events DROP FOREIGN KEY ${constraintName}`
    );
  }

  // Revert college_id column back to NOT NULL
  // Note: This might fail if there are null values - update or delete them first
  await queryInterface.changeColumn("events", "college_id", {
    type: DataTypes.INTEGER,
    allowNull: false,
  });

  // Re-add the foreign key constraint
  // Note: We can't use SET NULL with NOT NULL, so use CASCADE or RESTRICT
  await queryInterface.addConstraint("events", {
    fields: ["college_id"],
    type: "foreign key",
    name: constraintName,
    references: {
      table: "colleges",
      field: "id",
    },
    onDelete: "CASCADE", // Changed from SET NULL to CASCADE for NOT NULL column
    onUpdate: "CASCADE",
  });
}
