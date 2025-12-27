import CollegeRankingService from "../../services/college/CollegeRanking.service.js";

const collegeRankingService = new CollegeRankingService();

class CollegeRankingController {
  static async listRankings(req, res) {
    try {
      const rankings = await collegeRankingService.listRankings(req.query);
      return res.status(200).json({
        message: "success",
        items: rankings,
      });
    } catch (error) {
      console.error("Error getting college rankings:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async getRankingsByProgram(req, res) {
    try {
      const rankings = await collegeRankingService.getRankingsByProgram(
        req.query.program_id
      );
      return res.status(200).json({
        message: "success",
        items: rankings,
      });
    } catch (error) {
      console.error("Error getting rankings by program:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async createRanking(req, res) {
    try {
      const ranking = await collegeRankingService.createRanking(req.body);
      return res.status(201).json({
        message: "College ranking created",
        ranking,
      });
    } catch (error) {
      console.error("Error creating college ranking:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateRankingOrder(req, res) {
    try {
      const rankings = await collegeRankingService.updateRankingOrder(
        req.body.program_id,
        req.body.rankings
      );
      return res.status(200).json({
        message: "Ranking order updated",
        items: rankings,
      });
    } catch (error) {
      console.error("Error updating ranking order:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteRanking(req, res) {
    try {
      await collegeRankingService.deleteRanking(req.query.ranking_id);
      return res.status(200).json({ message: "Ranking deleted" });
    } catch (error) {
      console.error("Error deleting ranking:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteProgramRankings(req, res) {
    try {
      await collegeRankingService.deleteRankingsByProgram(req.query.program_id);
      return res.status(200).json({
        message: "All rankings for program deleted",
      });
    } catch (error) {
      console.error("Error deleting program rankings:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateProgramOrder(req, res) {
    try {
      const result = await collegeRankingService.updateProgramOrder(
        req.body.programOrders
      );
      return res.status(200).json({
        message: "Program order updated",
        ...result,
      });
    } catch (error) {
      console.error("Error updating program order:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default CollegeRankingController;
