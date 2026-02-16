import ScholarshipApplicationService from "../../services/scholarship-application/ScholarshipApplication.service.js";
import { roleHelper } from "../../utils/RoleHelper.js";

const scholarshipApplicationService = new ScholarshipApplicationService();

class ScholarshipApplicationController {
  static async applyForScholarship(req, res) {
    try {
      const studentId = req.user.id;
      const { scholarshipId } = req.body;

      // Check if user has student role
      const userRoles = roleHelper(req.user?.role);
      
      if (!userRoles?.student) {
        return res.status(403).json({
          message: "Only students can apply for scholarships",
          error: "Forbidden: Student role required",
        });
      }

      const application = await scholarshipApplicationService.applyForScholarship(
        studentId,
        scholarshipId
      );

      return res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
  static async checkIfScholarshipApplied(req, res) {
    try {
      const studentId = req.user.id;
      const {  scholarshipId} = req.params;

  
      const application = await scholarshipApplicationService.checkIfScholarshipIsApplied(
        studentId,
        scholarshipId
      );

      return res.status(200).json(application);
    } catch (error) {
      console.error("Error checking scholarship application:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getStudentApplications(req, res) {
    try {
      const studentId = req.user.id;
      const result = await scholarshipApplicationService.getStudentApplications(
        studentId,
        req.query
      );

      return res.status(200).json({
        message: "Applications retrieved",
        ...result,
      });
    } catch (error) {
      console.error("Error getting student applications:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getAllApplications(req, res) {
    try {
      const result = await scholarshipApplicationService.getAllApplications(req.query);

      return res.status(200).json({
        message: "Applications retrieved",
        ...result,
      });
    } catch (error) {
      console.error("Error getting all applications:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateApplicationStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const { status, remarks } = req.body;

      const application = await scholarshipApplicationService.updateApplicationStatus(
        applicationId,
        status,
        remarks
      );

      return res.status(200).json({
        message: "Application status updated",
        application,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async deleteApplication(req, res) {
    try {
      const { applicationId } = req.params;
      const studentId = req.user.id;

      // Check if user has student role
      const userRoles = roleHelper(req.user?.role);
      
      if (!userRoles?.student) {
        return res.status(403).json({
          message: "Only students can delete their own applications",
          error: "Forbidden: Student role required",
        });
      }

      const result = await scholarshipApplicationService.deleteApplication(
        applicationId,
        studentId
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting application:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default ScholarshipApplicationController;
