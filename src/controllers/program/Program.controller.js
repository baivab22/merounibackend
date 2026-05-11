import ProgramService from "../../services/program/Program.service.js";

const programService = new ProgramService();

class ProgramController {
  static async listPrograms(req, res) {
    try {
      const { items, pagination } = await programService.listPrograms({
        ...req.query,
        ...req.body,
      });

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }

  static async listAdminPrograms(req, res) {
    try {
      const { items, pagination } = await programService.listAdminPrograms({
        ...req.query,
        ...req.body,
      });

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }

  static async getProgram(req, res) {
    try {
      const program = await programService.getProgram(req.params.slug);
      return res.status(200).json(program);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Server error" : error.message,
      });
    }
  }

  static async createOrUpdateProgram(req, res) {
    try {
      const programId = await programService.createOrUpdateProgram(req.body);
      return res.status(200).json({
        message: req.body.id
          ? "Program updated successfully!"
          : "Program created successfully!",
        programId,
      });
    } catch (error) {
      console.error("Error creating/updating program:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        stack: error.stack,
      });
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }

  static async saveAsDraft(req, res) {
    try {
      const programId = await programService.createOrUpdateProgram({
        ...req.body,
        status: "draft",
      });
      return res.status(200).json({
        message: req.body.id
          ? "Program updated as draft successfully!"
          : "Program saved as draft successfully!",
        programId,
      });
    } catch (error) {
      console.error("Error saving program as draft:", error);
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }

  static async deleteProgram(req, res) {
    try {
      const { id } = req.params;
      await programService.deleteProgram(id);
      return res.status(200).json({ message: "Program deleted successfully!" });
    } catch (error) {
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }
}

export default ProgramController;
