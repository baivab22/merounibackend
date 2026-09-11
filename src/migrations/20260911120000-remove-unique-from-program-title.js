/**
 * Remove the unique constraint on programs.title so that different
 * universities can offer programs with the same name.
 */
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const candidates = ["title", "programs_title_unique", "programs_title"].filter(
    (name) => typeof name === "string",
  );

  for (const name of candidates) {
    try {
      await queryInterface.removeIndex("programs", name);
      console.log(`Removed unique index '${name}' on programs.title`);
      return;
    } catch (error) {
      // Try the next candidate name
    }
  }

  // Fallback: try removing it as a constraint
  for (const name of ["title_unique", "programs_title_unique", "title"]) {
    try {
      await queryInterface.removeConstraint("programs", name);
      console.log(`Removed unique constraint '${name}' on programs.title`);
      return;
    } catch (error) {
      // Try the next candidate name
    }
  }

  console.log("Unique constraint/index on programs.title not found or already removed.");
}

export async function down(queryInterface, Sequelize) {
  try {
    await queryInterface.addIndex("programs", ["title"], {
      unique: true,
      name: "title",
    });
  } catch (error) {
    console.error("Migration DOWN failed:", error);
  }
}