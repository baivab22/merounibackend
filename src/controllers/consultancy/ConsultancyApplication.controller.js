import ConsultancyApplicationService from "../../services/consultancy/ConsultancyApplication.service.js";
import { roleHelper } from "../../utils/RoleHelper.js";

const applicationService = new ConsultancyApplicationService();

class ConsultancyApplicationController {
  static async apply(req, res) {
    try {
      const application = await applicationService.applyToConsultancy(req.body, req.user);
      return res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async agentApply(req, res) {
    try {
      const application = await applicationService.agentApplyToConsultancy(req.body, req.user);
      return res.status(201).json({
        message: "Agent application submitted successfully",
        application,
      });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async checkIfStudentAppliedToConsultancy(req, res) {
    const userId = req.user.id;
    try {
      const { consultancyId } = req.params;
      const result = await applicationService.checkIfStudentAppliedToConsultancy(consultancyId, userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async getUserApplications(req, res) {
    try {
      const applications = await applicationService.getUserApplications(req.user.id);
      return res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async getConsultancyApplications(req, res) {
    try {
      const userRoles = roleHelper(req.user?.roles);
      let consultancyId = req.params.consultancy_id;

      // If consultancy role, they can only see their own applications
      if (userRoles?.consultancy) {
        consultancyId = req.user.consultancyId;
      }

      if (!consultancyId && !userRoles?.admin && !userRoles?.editor) {
        return res.status(403).json({ error: "Consultancy ID is required" });
      }

      const applications = await applicationService.getConsultancyApplications(consultancyId);
      return res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async getAllApplications(req, res) {
    try {
      const applications = await applicationService.listAllApplications(req.query);
      return res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;
      const application = await applicationService.updateStatus(id, status, remarks, req.user);
      return res.status(200).json({
        message: "Application status updated successfully",
        application,
      });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async deleteApplication(req, res) {
    try {
      const { id } = req.params;
      const result = await applicationService.deleteApplication(id, req.user);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }
}

export default ConsultancyApplicationController;
