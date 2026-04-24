import BackupCron from "./crons/Backup.cron.js";
import SearchTermCleanupCron from "./crons/SearchTermCleanup.cron.js";

/**
 * Initializes and schedules all automated cron jobs.
 */
const initCrons = async () => {
  try {
    console.log("[CronLoader] Initializing automated tasks...");

    // Initialize automated database backups
    await BackupCron.init();

    // Initialize search term cleanup
    SearchTermCleanupCron.init();

    console.log("[CronLoader] All crons initialized successfully.");
  } catch (error) {
    console.error("[CronLoader] Error initializing crons:", error);
  }
};

export default initCrons;
