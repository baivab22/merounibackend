import { spawn } from "child_process";
import envConfig from "../../config/env.config.js";

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
}

export default DatabaseService;
