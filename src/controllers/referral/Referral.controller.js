import ReferralService from "../../services/referral/Referral.service.js";

const referralService = new ReferralService();

class ReferralController {
  static async createReferredApplication(req, res) {
    try {
      await referralService.createReferredApplication(req.body);

      return res
        .status(201)
        .json({ message: "Referred application submitted successfully" });
    } catch (error) {
      console.error("Error details:", error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async createSelfApplication(req, res) {
    try {
      const student = await referralService.createSelfApplication(req.body);

      return res.status(201).json({
        message: "Self-application submitted successfully",
        student,
      });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async getApplications(req, res) {
    try {
      const applications = await referralService.getApplications(req.user);
      return res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async getUserReferrals(req, res) {
    try {
      const referrals = await referralService.getUserReferrals(req.user);
      return res.status(200).json(referrals);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async getApplicationsByType(req, res) {
    try {
      const applications = await referralService.getApplicationsByType(
        req.params.type
      );

      return res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async getCollegeApplications(req, res) {
    try {
      const applications = await referralService.getCollegeApplications(
        req.params.college_id
      );
      return res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async getCollegeApplicationsByType(req, res) {
    try {
      const applications = await referralService.getCollegeApplicationsByType(
        req.params.college_id,
        req.params.type
      );

      return res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }
}

export default ReferralController;
