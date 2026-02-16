import ReferralService from "../../services/referral/Referral.service.js";

const referralService = new ReferralService();

class ReferralController {
  static async createReferredApplication(req, res) {
    try {
      await referralService.createReferredApplication(req.body, req.user);

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

  static async checkIfAlreadyAppliedForCollage(req, res) {
    try {
      const user = req.user;
      console.log(user, "useruser")
      const { college_id } = req.query;
      console.log(college_id, "college_id")
      const result = await referralService.checkIfAlreadyAppliedForCollage(
        college_id,
        user.id
      );
      return res.status(200).json(result);
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
      await referralService.createReferredApplication(req.body, req.user);

      return res
        .status(201)
        .json({ message: "Agent application submitted successfully" });
    } catch (error) {
      console.error("Error details:", error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async createSelfApplication(req, res) {
    const userId = req.user.id;
    try {
      const student = await referralService.createSelfApplication(req.body, userId);

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
      if (!req.user) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }
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
        req.params.type,
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
        req.params.college_id,
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
        req.params.type,
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

  static async getInstitutionApplications(req, res) {
    try {
      const applications = await referralService.getInstitutionApplications(
        req.user,
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

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;

      const referral = await referralService.updateStatus(id, status, remarks);

      return res.status(200).json({
        message: "Referral status updated successfully",
        referral,
      });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async deleteReferral(req, res) {
    try {
      const { id } = req.params;
      await referralService.deleteReferral(id, req.user);
      return res.status(200).json({ message: "Referral deleted successfully" });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal Server Error" : error.message,
      });
    }
  }

  static async getTopAgents(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 5;
      const result = await referralService.getTopAgents(limit);
      return res.status(200).json({
        message: "Top agents retrieved successfully",
        data: result,
      });
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
