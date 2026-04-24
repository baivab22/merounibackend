import ConfigService from "../../services/config/Config.service.js";
import BackupCron from "../../crons/Backup.cron.js";

const configService = new ConfigService();

class ConfigController {
  static async list(req, res) {
    try {
      const { items, pagination } = await configService.list(req.query);
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error listing configs:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async getByType(req, res) {
    try {
      const config = await configService.getByType(req.params.type);
      return res.status(200).json({ message: "success", config });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      console.error("Error getting config:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async createOrUpdate(req, res) {
    try {
      const config = await configService.createOrUpdate(req.body);

      // If the backup interval is updated, reschedule the cron job
      if (req.body.type === "database_backup_interval") {
        BackupCron.scheduleBackup(config.value);
      }

      return res.status(200).json({
        message: "Config saved",
        config,
      });
    } catch (error) {
      console.error("Error saving config:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const config = await configService.create(req.body);
      return res.status(201).json({
        message: "Config created",
        config,
      });
    } catch (error) {
      console.error("Error creating config:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateByType(req, res) {
    try {
      const config = await configService.updateByType(
        req.params.type,
        req.body,
      );

      // If the backup interval is updated, reschedule the cron job
      if (req.params.type === "database_backup_interval") {
        BackupCron.scheduleBackup(config.value);
      }

      return res.status(200).json({
        message: "Config updated",
        config,
      });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      console.error("Error updating config:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteByType(req, res) {
    try {
      await configService.deleteByType(req.params.type);
      return res.status(200).json({
        message: "Config deleted",
      });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      console.error("Error deleting config:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default ConfigController;
