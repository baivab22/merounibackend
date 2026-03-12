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

  static async getRankingsByDegree(req, res) {
    try {
      const rankings = await collegeRankingService.getRankingsByDegree(
        req.query.degree_id
      );
      return res.status(200).json({
        message: "success",
        items: rankings,
      });
    } catch (error) {
      console.error("Error getting rankings by degree:", error);
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
        req.body.degree_id,
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

  static async deleteDegreeRankings(req, res) {
    try {
      await collegeRankingService.deleteRankingsByDegree(req.query.degree_id);
      return res.status(200).json({
        message: "All rankings for degree deleted",
      });
    } catch (error) {
      console.error("Error deleting degree rankings:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateDegreeOrder(req, res) {
    try {
      const result = await collegeRankingService.updateDegreeOrder(
        req.body.degreeOrders
      );
      return res.status(200).json({
        message: "Degree order updated",
        ...result,
      });
    } catch (error) {
      console.error("Error updating degree order:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }
  static async updateDegreeDescription(req, res) {
    try {
      const result = await collegeRankingService.updateDegreeDescription(
        req.body.degree_id,
        req.body.description
      );
      return res.status(200).json({
        message: "Degree description updated",
        ...result,
      });
    } catch (error) {
      console.error("Error updating degree description:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default CollegeRankingController;
