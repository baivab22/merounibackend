import VacancyService from "../../services/vacancy/Vacancy.service.js";

const vacancyService = new VacancyService();

class VacancyController {
  static async listVacancies(req, res) {
    try {
      const { items, pagination } = await vacancyService.listVacancies(
        req.query
      );

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error in listVacancies:", error);
      return res
        .status(500)
        .json({ message: `Server Error: ${error.message}` });
    }
  }

  static async getVacancyBySlug(req, res) {
    try {
      const vacancy = await vacancyService.getVacancyBySlug(req.params.slugs);

      return res.status(200).json({
        message: "success",
        item: vacancy,
      });
    } catch (error) {
      console.error("Error in getVacancyBySlug:", error);
      return res
        .status(500)
        .json({ message: `Server Error: ${error.message}` });
    }
  }

  static async createVacancy(req, res) {
    try {
      const item = await vacancyService.createVacancy(req.body);

      return res.status(201).json({ message: "Vacancy created", item });
    } catch (error) {
      console.error("Error creating vacancy:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateVacancy(req, res) {
    try {
      const vacancy = await vacancyService.updateVacancy(
        req.query.id,
        req.body
      );

      return res
        .status(200)
        .json({ message: "Vacancy updated successfully", vacancy });
    } catch (error) {
      console.error("Error updating vacancy:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteVacancy(req, res) {
    try {
      await vacancyService.deleteVacancy(req.query.id);
      return res.status(200).json({ message: "Vacancy deleted" });
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default VacancyController;
