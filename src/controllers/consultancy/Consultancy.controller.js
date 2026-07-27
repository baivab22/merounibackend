import ConsultancyService from "../../services/consultancy/Consultancy.service.js";

const consultancyService = new ConsultancyService();

class ConsultancyController {
  static async listConsultancy(req, res) {
    try {
      const { items, pagination } = await consultancyService.listConsultancy(
        req.query
      );

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getMyConsultancy(req, res) {
    try {
      const consultancy = await consultancyService.getMyConsultancy(
        req.user.id
      );
      return res
        .status(200)
        .json({ message: "Consultancy retrieved", consultancy });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getConsultancy(req, res) {
    try {
      const consultancy = await consultancyService.getConsultancy(
        req.params.slug
      );
      return res
        .status(200)
        .json({ message: "Consultancy retrieved", consultancy });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async createOrUpdateConsultancy(req, res) {
    try {
      const consultancy = await consultancyService.createOrUpdateConsultancy(
        req.body
      );
      return res
        .status(200)
        .json({ message: "Consultancy saved successfully", consultancy });
    } catch (error) {
      const status = error.status || 500;
      console.error("Error in createOrUpdateConsultancy:", error);
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async deleteConsultancy(req, res) {
    try {
      await consultancyService.deleteConsultancy(req.query.id);
      return res
        .status(200)
        .json({ message: "Consultancy deleted successfully" });
    } catch (error) {
      const status = error.status || 500;
      console.error("Error deleting consultancy:", error);
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }
  static async updateConsultancyOrder(req, res) {
    try {
      const result = await consultancyService.updateConsultancyOrder(req.body.consultancies);
      return res.status(200).json(result);
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
      });
    }
  }

  static async updateVerifiedStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_verified } = req.body;
      await consultancyService.updateVerifiedStatus(id, is_verified);
      return res.status(200).json({
        message: "Verified status updated successfully!",
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
      });
    }
  }

  static async updateReferableStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_referable } = req.body;
      await consultancyService.updateReferableStatus(id, is_referable);
      return res.status(200).json({
        message: "Referable status updated successfully!",
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
      });
    }
  }

  static async listUniqueLocationsAndDestinations(req, res) {
    try {
      const data = await consultancyService.getUniqueLocationsAndDestinations();
      return res.status(200).json({
        message: "success",
        data,
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default ConsultancyController;
