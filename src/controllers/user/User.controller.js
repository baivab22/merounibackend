import UserService from "../../services/user/User.service.js";

const userService = new UserService();

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

  static async getUserProfile(req, res) {
    try {
      const user = await userService.getUserProfile(req.query.id);
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

  static async listPendingAgentRole(req, res) {
    try {
      const { items, pagination } = await userService.listPendingAgentRole(
        req.query
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
}

export default UserController;
