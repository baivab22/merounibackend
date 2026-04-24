import cron from "node-cron";
import { Op } from "sequelize";
import SearchTerm from "../models/search/SearchTerm.model.js";

class SearchTermCleanupCron {
  /**
   * Initializes the search term cleanup cron job.
   * Scheduled to run every day at midnight.
   */
  init() {
    // Run every 5 minutes: */5 * * * *
    cron.schedule("*/5 * * * *", () => {
      console.log(
        "[SearchTermCleanup] Starting cleanup of foul search terms...",
      );
      this.cleanup();
    });

    console.log(
      "[SearchTermCleanup] Search term cleanup scheduled (Every 5 minutes)",
    );
  }

  /**
   * Performs the cleanup by deleting search terms that contain foul words.
   */
  async cleanup() {
    const foulWords = ["lado", "mugi", "khatey", "saley"];

    try {
      const whereConditions = foulWords.map((word) => ({
        term: {
          [Op.like]: `%${word}%`,
        },
      }));

      const deletedCount = await SearchTerm.destroy({
        where: {
          [Op.or]: whereConditions,
        },
      });

      if (deletedCount > 0) {
        console.log(
          `[SearchTermCleanup] Successfully deleted ${deletedCount} foul search terms.`,
        );
      } else {
        console.log("[SearchTermCleanup] No foul search terms found.");
      }
    } catch (error) {
      console.error(
        "[SearchTermCleanup] Error during search term cleanup:",
        error,
      );
    }
  }
}

export default new SearchTermCleanupCron();
