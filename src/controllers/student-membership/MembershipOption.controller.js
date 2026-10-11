import MembershipOptionService from "../../services/student-membership/MembershipOption.service.js";

const membershipOptionService = new MembershipOptionService();

class MembershipOptionController {
  static async getPublicOptions(req, res) {
    try {
      const options = await membershipOptionService.getGroupedOptions();
      return res.status(200).json({ message: "Membership options retrieved", options });
    } catch (error) {
      console.error("Error getting membership options:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getAdminOptions(req, res) {
    try {
      const options = await membershipOptionService.listOptions(req.query);
      return res.status(200).json({ message: "Membership options retrieved", options });
    } catch (error) {
      console.error("Error getting admin membership options:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async createOption(req, res) {
    try {
      const option = await membershipOptionService.createOption(req.body);
      return res.status(201).json({ message: "Membership option created", option });
    } catch (error) {
      console.error("Error creating membership option:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateOption(req, res) {
    try {
      const option = await membershipOptionService.updateOption(req.params.id, req.body);
      return res.status(200).json({ message: "Membership option updated", option });
    } catch (error) {
      console.error("Error updating membership option:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async deleteOption(req, res) {
    try {
      const result = await membershipOptionService.deleteOption(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting membership option:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default MembershipOptionController;
