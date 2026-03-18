
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    try {
        // Attempt to remove the unique index/constraint on 'title'
        // Depending on the DB and Sequelize version, it might be named 'title' or 'exams_title_unique'
        await queryInterface.removeIndex("exams", "title").catch(async () => {
            await queryInterface.removeConstraint("exams", "title_unique").catch(() => {
                console.log("Unique constraint/index on 'title' not found or already removed.");
            });
        });
    } catch (error) {
        console.error("Migration UP failed:", error);
    }
}

export async function down(queryInterface, Sequelize) {
    try {
        await queryInterface.addIndex("exams", ["title"], {
            unique: true,
            name: "title",
        });
    } catch (error) {
        console.error("Migration DOWN failed:", error);
    }
}
