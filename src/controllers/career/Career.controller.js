import CareerService from "../../services/career/Career.service.js";

const careerService = new CareerService();

class CareerController {
  static async listCareers(req, res) {
    try {
      const { items, pagination } = await careerService.listCareers(req.query);

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error in listCareers:", error);
      return res
        .status(500)
        .json({ message: `Server Error: ${error.message}` });
    }
  }

  static async getCareerBySlug(req, res) {
    try {
      const careerPost = await careerService.getCareerBySlug(req.params.slugs);

      return res.status(200).json({
        message: "success",
        item: careerPost,
      });
    } catch (error) {
      console.error("Error in getCareerBySlug:", error);
      return res
        .status(500)
        .json({ message: `Server Error: ${error.message}` });
    }
  }

  static async createCareer(req, res) {
    try {
      const item = await careerService.createCareer(req.body);

      return res.status(201).json({ message: "Career created", item });
    } catch (error) {
      console.error("Error creating career:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateCareer(req, res) {
    try {
      const career = await careerService.updateCareer(req.query.id, req.body);

      return res
        .status(200)
        .json({ message: "Career updated successfully", career });
    } catch (error) {
      console.error("Error updating career:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteCareer(req, res) {
    try {
      await careerService.deleteCareer(req.query.id);
      return res.status(200).json({ message: "Career deleted" });
    } catch (error) {
      console.error("Error deleting career:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default CareerController;
