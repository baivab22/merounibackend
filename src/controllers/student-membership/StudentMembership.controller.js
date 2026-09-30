import StudentMembershipService from "../../services/student-membership/StudentMembership.service.js";
import { roleHelper } from "../../utils/RoleHelper.js";

const studentMembershipService = new StudentMembershipService();

class StudentMembershipController {
  static async applyForMembership(req, res) {
    try {
      const studentId = req.user.id;
      const userRoles = roleHelper(req.user?.role);

      if (!userRoles?.student) {
        return res.status(403).json({
          message: "Only students can apply for memberships",
          error: "Forbidden: Student role required",
        });
      }

      const membership = await studentMembershipService.applyForMembership(studentId, req.body);

      return res.status(201).json({
        message: "Membership application submitted successfully",
        membership,
      });
    } catch (error) {
      console.error("Error applying for membership:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async applyForMembershipAsGuest(req, res) {
    try {
      const membership = await studentMembershipService.applyForMembershipAsGuest(req.body);

      return res.status(201).json({
        message: "Membership application submitted successfully",
        membership,
      });
    } catch (error) {
      console.error("Error submitting guest membership application:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getStudentMemberships(req, res) {
    try {
      const studentId = req.user.id;
      const result = await studentMembershipService.getStudentMemberships(studentId, req.query);

      return res.status(200).json({
        message: "Memberships retrieved",
        ...result,
      });
    } catch (error) {
      console.error("Error getting student memberships:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getAllMemberships(req, res) {
    try {
      const result = await studentMembershipService.getAllMemberships(req.query);

      return res.status(200).json({
        message: "Memberships retrieved",
        ...result,
      });
    } catch (error) {
      console.error("Error getting all memberships:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getMembershipById(req, res) {
    try {
      const { id } = req.params;
      const membership = await studentMembershipService.getMembershipById(id);

      return res.status(200).json({
        message: "Membership retrieved",
        membership,
      });
    } catch (error) {
      console.error("Error getting membership:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateMembership(req, res) {
    try {
      const { id } = req.params;
      const membership = await studentMembershipService.updateMembership(id, req.body);

      return res.status(200).json({
        message: "Membership updated successfully",
        membership,
      });
    } catch (error) {
      console.error("Error updating membership:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateMembershipStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, start_date, end_date, remarks } = req.body;

      const membership = await studentMembershipService.updateMembershipStatus(
        id,
        status,
        start_date,
        end_date,
        remarks
      );

      return res.status(200).json({
        message: "Membership status updated",
        membership,
      });
    } catch (error) {
      console.error("Error updating membership status:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async deleteMembership(req, res) {
    try {
      const { id } = req.params;
      const result = await studentMembershipService.deleteMembership(id);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting membership:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default StudentMembershipController;