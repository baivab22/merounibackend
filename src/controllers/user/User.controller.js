import UserService from "../../services/user/User.service.js";
import PasswordService from "../../services/user/Password.service.js";

const userService = new UserService();
const passwordService = new PasswordService();

class UserController {
  static async listUsers(req, res) {
    try {
      const { items, pagination } = await userService.listUsers(req.query);
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error in listUsers:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async listPendingAgents(req, res) {
    try {
      const { items, pagination } = await userService.listPendingAgents(
        req.query,
      );
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error in listPendingAgents:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async getUserProfile(req, res) {
    try {
      const userId = req.query.id || req.user.id;
      const user = await userService.getUserProfile(userId);
      return res.status(200).json({
        message: "success",
        user,
      });
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async exportUsers(req, res) {
    try {
      const csv = await userService.exportUsers(req.query);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=users.csv");

      return res.status(200).send(csv);
    } catch (error) {
      console.error("Error in exportUsers:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.body.user_id, req.user);

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error in deleteUser:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async updateUserProfile(req, res) {
    try {
      await userService.updateUserProfile(req.query.user_id, req.body);

      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async updateUserDetails(req, res) {
    try {
      await userService.updateUserDetails(req.user.id, req.body);

      return res
        .status(200)
        .json({ message: "User details updated successfully" });
    } catch (error) {
      console.error("Error updating user details:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async listPendingAgentRole(req, res) {
    try {
      const { items, pagination } = await userService.listPendingAgentRole(
        req.query,
      );

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error fetching pending agent roles:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async applyForAgentRole(req, res) {
    try {
      await userService.applyForAgentRole(req.body, req.user);

      return res.status(200).json({
        message: "Agent role application submitted successfully.",
      });
    } catch (error) {
      console.error("Error applying for agent role:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async reviewAgentRequest(req, res) {
    try {
      const user = await userService.reviewAgentRequest(req.body, req.user);

      return res.status(200).json({
        message: `Agent role request ${req.body.action}d successfully.`,
        user,
      });
    } catch (error) {
      console.error("Error reviewing agent request:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async createCollegeCredentials(req, res) {
    try {
      const user = await userService.createCollegeCredentials(req.body);
      return res.status(201).json({
        message: "College credentials created successfully",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNo: user.phoneNo,
          roles: user.roles,
          createdByAdmin: user.createdByAdmin,
          collegeId: user.collegeId,
        },
      });
    } catch (error) {
      console.error("Error in createCollegeCredentials:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async createConsultancyCredentials(req, res) {
    try {
      const user = await userService.createConsultancyCredentials(req.body);
      return res.status(201).json({
        message: "Consultancy credentials created successfully",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNo: user.phoneNo,
          roles: user.roles,
          createdByAdmin: user.createdByAdmin,
          consultancyId: user.consultancyId,
        },
      });
    } catch (error) {
      console.error("Error in createCollegeCredentials:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }
  static async changePassword(req, res) {
    try {
      await passwordService.changePassword(req.user.id, req.body);
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error in changePassword:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }
}

export default UserController;
