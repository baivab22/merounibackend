import CollegeService from "../../services/college/College.service.js";
import { formatServiceError } from "../../utils/formatServiceError.js";

const collegeService = new CollegeService();

class CollegeController {
  static async updateReferableStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_referable } = req.body;
      await collegeService.updateReferableStatus(id, is_referable);
      return res.status(200).json({
        message: "Referable status updated successfully!",
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async updateVerifiedStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_verified } = req.body;
      await collegeService.updateVerifiedStatus(id, is_verified);
      return res.status(200).json({
        message: "Verified status updated successfully!",
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async createOrUpdateCollege(req, res) {
    try {
      const { collegeId, isNew } = await collegeService.createOrUpdateCollege(
        req.body,
      );
      return res.status(200).json({
        message: isNew
          ? "College created successfully!"
          : "College updated successfully!",
        collegeId,
      });
    } catch (error) {
      console.log(error, "THank");
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async saveAsDraft(req, res) {
    try {
      const { collegeId, isNew } = await collegeService.createOrUpdateCollege({
        ...req.body,
        status: "draft",
      });
      return res.status(200).json({
        message: isNew
          ? "College saved as draft successfully!"
          : "College updated as draft successfully!",
        collegeId,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async listInstitutionsForAdmission(req, res) {
    try {
      const items = await collegeService.listInstitutionsForAdmission(
        req.query,
      );
      return res.status(200).json({
        message: "success",
        items,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || "Server error",
        error: error.message,
      });
    }
  }

  static async listAdmissions(req, res) {
    try {
      const { items, pagination } = await collegeService.listAdmissions(
        req.query,
      );

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.log(error, "THank");
      const status = error.status || 500;
      return res.status(status).json({
        status,
        message: `Error: ${error.message}`,
      });
    }
  }

  static async getAdmissionById(req, res) {
    try {
      const admission = await collegeService.getAdmissionById(req.params.id);

      return res.status(200).json({
        message: "success",
        item: admission,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message: `Error: ${error.message}`,
      });
    }
  }

  static async listColleges(req, res) {
    try {
      let isAdmin = false;
      const roles = req.user?.roles || req.user?.role;
      if (roles) {
        try {
          const userRoles =
            typeof roles === "string" ? JSON.parse(roles) : roles;
          if (userRoles["admin"] || userRoles["editor"]) {
            isAdmin = true;
          }
        } catch (e) {
          // ignore parsing error
        }
      }

      const { items, pagination } = await collegeService.listColleges(
        {
          ...req.query,
          ...req.body,
        },
        isAdmin,
      );

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getCollegeBySlug(req, res) {
    try {
      const college = await collegeService.getCollegeBySlug(req.params.slug);

      return res.status(200).json({ item: college });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: error.message });
    }
  }

  static async deleteCollege(req, res) {
    try {
      await collegeService.deleteCollege(req.params.id);
      return res.status(200).json({ message: "College deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getCollegeByInstitutionUser(req, res) {
    try {
      const college = await collegeService.getCollegeByInstitutionUser(
        req.user,
      );
      return res.status(200).json({ item: college });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ error: error.message });
    }
  }

  static async updateCollegeByInstitutionUser(req, res) {
    try {
      const { collegeId, isNew } =
        await collegeService.updateCollegeByInstitutionUser(req.user, req.body);
      return res.status(200).json({
        message: isNew
          ? "College created successfully!"
          : "College updated successfully!",
        collegeId,
      });
    } catch (error) {
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: error.message || "Server error" });
    }
  }

  static async updateCollegeOrder(req, res) {
    try {
      const result = await collegeService.updateCollegeOrder(req.body.colleges);
      return res.status(200).json(result);
    } catch (error) {
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: error.message || "Server error" });
    }
  }

  static async updateAdmissionOrder(req, res) {
    try {
      const result = await collegeService.updateAdmissionOrder(
        req.body.admissions,
      );
      return res.status(200).json(result);
    } catch (error) {
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: error.message || "Server error" });
    }
  }

  static async createOrUpdateAdmission(req, res) {
    try {
      const { id, isNew } = await collegeService.createOrUpdateAdmission(
        req.body,
      );
      return res.status(200).json({
        message: isNew
          ? "Admission created successfully!"
          : "Admission updated successfully!",
        id,
      });
    } catch (error) {
      const formatted = formatServiceError(error);
      return res.status(formatted.status).json(formatted);
    }
  }

  static async deleteAdmission(req, res) {
    try {
      await collegeService.deleteAdmission(req.params.id);
      return res
        .status(200)
        .json({ message: "Admission deleted successfully!" });
    } catch (error) {
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || "Server error",
      });
    }
  }

  static async getFeaturedColleges(req, res) {
    try {
      const result = await collegeService.getFeaturedColleges(req.query);
      return res.status(200).json({
        message: "success",
        items: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async listProgramsByCollegeId(req, res) {
    try {
      const programs = await collegeService.listProgramsByCollegeId(
        req.params.id,
      );
      return res.status(200).json({
        message: "success",
        items: programs,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }
}

export default CollegeController;
