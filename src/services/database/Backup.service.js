import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import cron from "node-cron";
import DatabaseService from "./Database.service.js";
import ConfigService from "../config/Config.service.js";
import { sendMail } from "../../utils/Mail.util.js";
import envConfig from "../../config/env.config.js";

const databaseService = new DatabaseService();
const configService = new ConfigService();

class BackupService {
    constructor() {
        this.backupJob = null;
    }

    /**
     * Initializes the backup cron job based on the current configuration.
     */
    async init() {
        try {
            const config = await configService.getByType("database_backup_interval");
            const interval = config?.value || "Weekly";
            this.scheduleBackup(interval);
        } catch (error) {
            console.warn("[BackupService] Warning: No backup interval found in config. Defaulting to Weekly.");
            this.scheduleBackup("Weekly");
        }
    }

    /**
     * Schedules or reschedules the backup job.
     */
    scheduleBackup(interval) {
        if (this.backupJob) {
            this.backupJob.stop();
        }

        let cronTime;
        switch (interval.toLowerCase()) {
            case "daily":
                cronTime = "0 0 * * *"; // Every day at midnight
                break;
            case "monthly":
                cronTime = "0 0 1 * *"; // First day of every month at midnight
                break;
            case "weekly":
            default:
                cronTime = "0 0 * * 0"; // Every Sunday at midnight
                break;
        }

        this.backupJob = cron.schedule(cronTime, () => {
            console.log(`[BackupService] Starting automated backup (Interval: ${interval})...`);
            this.performBackup();
        });

        console.log(`[BackupService] Backup scheduled with interval: ${interval} (${cronTime})`);
    }

    /**
     * Performs the backup, zips it, and emails it.
     */
    async performBackup() {
        const backupDir = path.resolve("./backups");
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const sqlFileName = `database-backup-${timestamp}.sql`;
        const zipFileName = `database-backup-${timestamp}.zip`;
        const sqlPath = path.join(backupDir, sqlFileName);
        const zipPath = path.join(backupDir, zipFileName);

        try {
            // 1. Generate SQL Backup
            console.log(`[BackupService] Generating SQL dump...`);
            await databaseService.generateBackupFile(sqlPath);

            // 2. Zip the backup
            console.log(`[BackupService] Zipping backup...`);
            const zip = new AdmZip();
            zip.addLocalFile(sqlPath);
            zip.writeZip(zipPath);

            // 3. Email the backup
            console.log(`[BackupService] Sending email to ${envConfig.MAIL_USER}...`);
            await sendMail(
                envConfig.MAIL_USER,
                "MeroUni Automated Database Backup",
                `Please find the automated database backup attached.`,
                `<h3>MeroUni Automated Database Backup</h3>
                 <p>Generated on: ${new Date().toLocaleString()}</p>
                 <p>Interval: ${await this.getInterval()}</p>`,
                [
                    {
                        filename: zipFileName,
                        path: zipPath,
                    },
                ]
            );

            console.log(`[BackupService] Backup completed and emailed successfully.`);

            // 4. Cleanup
            fs.unlinkSync(sqlPath);
            fs.unlinkSync(zipPath);
        } catch (error) {
            console.error(`[BackupService] Automated backup failed:`, error);
        }
    }

    async getInterval() {
        try {
            const config = await configService.getByType("database_backup_interval");
            return config?.value || "Weekly";
        } catch (e) {
            return "Weekly";
        }
    }
}

export default new BackupService();
