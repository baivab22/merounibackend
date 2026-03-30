import BackupService from "./services/database/Backup.service.js";

/**
 * Initializes and schedules all automated cron jobs.
 */
const initCrons = async () => {
    try {
        console.log("[CronLoader] Initializing automated tasks...");
        
        // Initialize automated database backups
        await BackupService.init();

        console.log("[CronLoader] All crons initialized successfully.");
    } catch (error) {
        console.error("[CronLoader] Error initializing crons:", error);
    }
};

export default initCrons;
