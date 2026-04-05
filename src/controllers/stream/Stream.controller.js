import StreamService from "../../services/stream/Stream.service.js";

const streamService = new StreamService();

class StreamController {
  static async listStreams(req, res) {
    try {
      const { items, pagination } = await streamService.listStreams(req.query);
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error in StreamController:", error);
      const status = error.status || (error.name === 'SequelizeUniqueConstraintError' ? 409 : 500);
      return res.status(status).json({
        message: status === 500 ? "Internal server error" : (error.errors?.[0]?.message || error.message),
        error: error.message,
      });
    }
  }

  static async getStream(req, res) {
    try {
      const item = await streamService.getStream(req.params.id);
      return res.status(200).json({ message: "Stream retrieved", item });
    } catch (error) {
      console.error("Error getting stream:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async createStream(req, res) {
    try {
      const item = await streamService.createStream(req.body);
      return res.status(201).json({ message: "Stream created", item });
    } catch (error) {
      console.error("Error creating stream:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateStream(req, res) {
    try {
      await streamService.updateStream(req.query.id || req.params.id, req.body);
      return res.status(200).json({ message: "Stream updated" });
    } catch (error) {
      console.error("Error updating stream:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async deleteStream(req, res) {
    try {
      await streamService.deleteStream(req.query.id || req.params.id);
      return res.status(200).json({ message: "Stream deleted" });
    } catch (error) {
      console.error("Error deleting stream:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async linkPrograms(req, res) {
    try {
      const { streamId } = req.params;
      const { programIds } = req.body;
      const item = await streamService.linkPrograms(streamId, programIds);
      return res.status(200).json({ message: "Programs linked successfully", item });
    } catch (error) {
      console.error("Error linking programs:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async unlinkProgram(req, res) {
    try {
      const { streamId, programId } = req.params;
      await streamService.unlinkProgram(streamId, programId);
      return res.status(200).json({ message: "Program unlinked successfully" });
    } catch (error) {
      console.error("Error unlinking program:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}


export default StreamController;
