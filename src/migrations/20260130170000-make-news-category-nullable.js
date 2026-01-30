import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const tableDescription = await queryInterface.describeTable("news");
  if (!tableDescription.category) return;

  const [results] = await queryInterface.sequelize.query(
    `SELECT CONSTRAINT_NAME 
     FROM information_schema.KEY_COLUMN_USAGE 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'news' 
     AND COLUMN_NAME = 'category' 
     AND REFERENCED_TABLE_NAME IS NOT NULL`
  );

  const constraintName =
    results?.[0]?.CONSTRAINT_NAME ?? "news_ibfk_3";

  await queryInterface.sequelize.query(
    `ALTER TABLE news DROP FOREIGN KEY \`${constraintName}\``
  );

  await queryInterface.changeColumn("news", "category", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await queryInterface.addConstraint("news", {
    fields: ["category"],
    type: "foreign key",
    name: constraintName,
    references: {
      table: "categories",
      field: "id",
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
}

export async function down(queryInterface) {
  const tableDescription = await queryInterface.describeTable("news");
  if (!tableDescription.category) return;

  const [results] = await queryInterface.sequelize.query(
    `SELECT CONSTRAINT_NAME 
     FROM information_schema.KEY_COLUMN_USAGE 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'news' 
     AND COLUMN_NAME = 'category' 
     AND REFERENCED_TABLE_NAME IS NOT NULL`
  );

  const constraintName =
    results?.[0]?.CONSTRAINT_NAME ?? "news_ibfk_3";

  try {
    await queryInterface.removeConstraint("news", constraintName);
  } catch {
    await queryInterface.sequelize.query(
      `ALTER TABLE news DROP FOREIGN KEY \`${constraintName}\``
    );
  }

  await queryInterface.changeColumn("news", "category", {
    type: DataTypes.INTEGER,
    allowNull: false,
  });

  await queryInterface.addConstraint("news", {
    fields: ["category"],
    type: "foreign key",
    name: constraintName,
    references: {
      table: "categories",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
}
