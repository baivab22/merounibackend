import DatabaseService from "../../services/database/Database.service.js";

const databaseService = new DatabaseService();

class DatabaseController {
    static async exportSql(req, res) {
        try {
            const mysqldump = await databaseService.exportSql();

            const fileName = `backup-${new Date()
                .toISOString()
                .slice(0, 10)}.sql`;

            res.setHeader("Content-Type", "application/sql");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=${fileName}`
            );

            // Handle spawn error
            mysqldump.on("error", (err) => {
                console.error("mysqldump spawn error:", err);
                if (!res.headersSent) {
                    res.status(500).json({ message: "Failed to start export" });
                }
            });

            // Stream database dump directly to response
            mysqldump.stdout.pipe(res);

            // Handle stderr
            mysqldump.stderr.on("data", (data) => {
                console.error(`mysqldump stderr: ${data}`);
            });

            // Handle close
            mysqldump.on("close", (code) => {
                if (code !== 0) {
                    console.error(`mysqldump exited with code ${code}`);
                    if (!res.headersSent) {
                        res.status(500).json({ message: "Export failed" });
                    }
                }
            });

        } catch (error) {
            console.error("Error exporting database:", error);

            if (!res.headersSent) {
                res.status(500).json({
                    message: "Server error",
                    error: error.message,
                });
            }
        }
    }
}

export default DatabaseController;
