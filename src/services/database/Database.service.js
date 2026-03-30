import { spawn } from "child_process";
import fs from "fs";
import envConfig from "../../config/env.config.js";
import Download from "../../models/downloads/Download.model.js";
import UserModel from "../../models/users/User.model.js";
import { sequelize } from "../../config/database.config.js";
import { QueryTypes } from "sequelize";

class DatabaseService {
    async exportSql() {
        const { DB_HOST, DB_USER, DB_PASS, DB_PORT } = envConfig;

        const args = [
            `--host=${DB_HOST}`,
            `--port=${DB_PORT || 3306}`,
            `--user=${DB_USER}`,
            "--all-databases",
            "--routines",
            "--triggers",
            "--events",
            "--single-transaction"
        ];

        const mysqldump = spawn("mysqldump", args, {
            env: {
                ...process.env,
                MYSQL_PWD: DB_PASS,
            },
        });

        return mysqldump;
    }

    async trackDownload(data) {
        return await Download.create({
            fileName: data.fileName,
            downloadType: data.downloadType,
            referenceId: data.referenceId || null,
            userId: data.userId || null,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
        });
    }

    async listDownloads(query = {}) {
        const { page = 1, limit = 10, type } = query;
        const offset = (page - 1) * limit;

        const where = {};
        if (type) {
            where.downloadType = type;
        }

        const { count, rows: downloads } = await Download.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: UserModel,
                    as: "user",
                    attributes: ["id", "firstName", "lastName", "email"],
                    required: false,
                },
            ],
        });

        return {
            downloads,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit),
            },
        };
    }

    async getDbStatus() {
        const { DB_NAME } = envConfig;

        try {
            await sequelize.authenticate();

            // Query for database size
            const [sizeData] = await sequelize.query(
                `SELECT SUM(data_length + index_length) / 1024 / 1024 AS size_mb 
                 FROM information_schema.TABLES 
                 WHERE table_schema = :dbName`,
                {
                    replacements: { dbName: DB_NAME },
                    type: QueryTypes.SELECT
                }
            );

            // Query for uptime
            const [uptimeData] = await sequelize.query(
                "SHOW GLOBAL STATUS LIKE 'Uptime'",
                { type: QueryTypes.SELECT }
            );
            const uptimeSeconds = parseInt(uptimeData?.Value || 0);
            const days = Math.floor(uptimeSeconds / (24 * 3600));
            const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);

            let uptimeParts = [];
            if (days > 0) uptimeParts.push(`${days}d`);
            if (hours > 0 || days > 0) uptimeParts.push(`${hours}h`);
            uptimeParts.push(`${minutes}m`);

            const uptimeFormatted = uptimeParts.join(" ");

            return {
                name: DB_NAME,
                status: "connected",
                size: `${parseFloat(sizeData?.size_mb || 0).toFixed(2)} MB`,
                uptime: uptimeFormatted
            };
        } catch (error) {
            return {
                name: DB_NAME,
                status: "disconnected",
                size: "unknown",
                error: error.message
            };
        }
    }

    async generateBackupFile(outputPath) {
        return new Promise(async (resolve, reject) => {
            try {
                const mysqldump = await this.exportSql();
                const writeStream = fs.createWriteStream(outputPath);

                mysqldump.stdout.pipe(writeStream);

                mysqldump.on("error", (err) => {
                    console.error("mysqldump spawn error:", err);
                    reject(err);
                });

                writeStream.on("finish", () => {
                    resolve();
                });

                writeStream.on("error", (err) => {
                    console.error("writeStream error:", err);
                    reject(err);
                });

                mysqldump.stderr.on("data", (data) => {
                    console.error(`mysqldump stderr: ${data}`);
                });

                mysqldump.on("close", (code) => {
                    if (code !== 0) {
                        reject(new Error(`mysqldump exited with code ${code}`));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default DatabaseService;
