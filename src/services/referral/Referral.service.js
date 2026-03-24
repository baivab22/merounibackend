import { Op, QueryTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import CollegeContact from "../../models/college/CollegeContact.model.js";
import Config from "../../models/config/Config.model.js";
import Referral from "../../models/referral/Referral.model.js";
import UserModel from "../../models/users/User.model.js";
import { roleHelper } from "../../utils/RoleHelper.js";
import Program from "../../models/program/Program.model.js";

class ReferralService {
  async createReferredApplication(payload, user) {
    const applications = Array.isArray(payload) ? payload : [payload];

    // Extract agent_id from the authenticated user
    if (!user || !user.id) {
      const error = new Error("Authentication required");
      error.status = 401;
      throw error;
    }

    const userRoles = roleHelper(user?.role);
    if (!userRoles?.agent) {
      const error = new Error("Only agents can create referrals");
      error.status = 403;
      throw error;
    }

    const agent_id = user.id;

    for (const application of applications) {
      const { college_id, students = [] } = application;

      if (!college_id) {
        const error = new Error("College ID is required");
        error.status = 400;
        throw error;
      }

      if (!Array.isArray(students) || students.length === 0) {
        const error = new Error("Students array is required");
        error.status = 400;
        throw error;
      }

      // Create one referral per student
      for (const student of students) {
        await Referral.create({
          college_id,
          agent_id,
          application_type: "referred",
          student_name: student.student_name,
          student_phone_no: student.student_phone_no,
          student_email: student.student_email,
          student_description: student.student_description,
          program_id: student.program_id || null,
          status: "IN_PROGRESS",
        });
      }
    }
  }


  async checkIfAlreadyAppliedForCollage(college_id, student_id) {
    const existing = await Referral.findOne({
      where: {
        college_id,
        student_id,
        application_type: "self",
      },
    });
    if (existing) {
      return {
        hasApplied: true,
        application_id: existing.id,
      }
    }
    return {
      hasApplied: false,
    }
  }

  async createSelfApplication(payload, student_id) {
    const { referral_type, college_id, program_id, description } =
      payload;

    const user = await UserModel.findOne({
      where: {
        id: student_id,
      },
    });

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    // Optional: prevent duplicate self applications for same college & student
    const existing = await Referral.findOne({
      where: {
        college_id,
        student_id,
        program_id,
        application_type: "self",
      },
    });

    if (existing) {
      return {
        hasApplied: true,
        message: "You have already applied for this college",
        application_id: existing.id,
      }
    }

    return Referral.create({
      college_id,
      student_id: student_id,
      student_name: `${user.firstName} ${user.middleName || ""} ${user.lastName || ""
        }`.trim(),
      student_phone_no: user.phoneNo,
      student_email: user.email,
      student_description: description,
      program_id,
      application_type: referral_type || "self",
      status: "IN_PROGRESS",
    });
  }

  async getApplications(user, query) {
    const {
      q,
      limit = 10,
      page = 1,
      status,
      college_id
    } = query;

    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    const offset = (pageNum - 1) * limitNum;
    const whereCondition = {};

    const userRoles = roleHelper(user?.role);

    if (userRoles?.agent && !userRoles?.admin && !userRoles?.editor) {
      whereCondition.agent_id = user.id;
    }

    if (status) {
      whereCondition.status = status;
    }

    if (college_id) {
      whereCondition.college_id = college_id;
    }

    if (q) {
      whereCondition[Op.or] = [
        { student_name: { [Op.substring]: q } },
        { student_email: { [Op.substring]: q } },
        { student_phone_no: { [Op.substring]: q } },
      ];
    }

    const { count, rows: referrals } = await Referral.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: UserModel,
          as: "referralAgent",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: College,
          as: "referralCollege",
          attributes: ["name", "slugs"],
        },
        {
          model: Program,
          as: "program",
          attributes: ["id", "title"],
        },
      ],
      limit: limitNum,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      items: referrals,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  async getUserReferrals(user) {
    const whereCondition = {};

    const userRoles = roleHelper(user?.role);

    if (userRoles?.agent) {
      whereCondition.agent_id = user.id;
    } else if (user?.id) {
      // student or other authenticated user
      whereCondition.student_id = user.id;
    }

    return Referral.findAll({
      where: whereCondition,
      include: [
        {
          model: College,
          as: "referralCollege",
          attributes: ["name", "slugs", "college_logo"],
          include: [
            {
              model: CollegeAddress,
              as: "address",
              attributes: ["country", "district", "city", "street", "postal_code"],
              required: false,
            },
            {
              model: CollegeContact,
              as: "contacts",
              attributes: ["contact_number"],
              required: false,
            },
          ],
        },
        {
          model: Program,
          as: "program",
          attributes: ["id", "title"],
        },
      ],
    });
  }

  async getApplicationsByType(type) {
    this.validateApplicationType(type);
    return Referral.findAll({
      where: { application_type: type },
      include: [],
    });
  }

  async getCollegeApplications(college_id) {
    await this.ensureCollegeExists(college_id);
    return Referral.findAll({
      where: { college_id },
      include: [
        {
          model: College,
          as: "referralCollege",
          attributes: ["name", "slugs"],
        },
        {
          model: Program,
          as: "program",
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getInstitutionApplications(user) {
    // Fetch the full user from database to get college_id
    const fullUser = await UserModel.findByPk(user?.id || user?.user_id);

    if (!fullUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    // Handle both camelCase (collegeId) and snake_case (college_id) field names
    const collegeId = fullUser.collegeId

    if (!collegeId) {
      const error = new Error("User is not associated with a college");
      error.status = 400;
      throw error;
    }

    return Referral.findAll({
      where: { college_id: collegeId },
      include: [
        {
          model: College,
          as: "referralCollege",
          attributes: ["name", "slugs"],
        },
        {
          model: Program,
          as: "program",
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getCollegeApplicationsByType(college_id, type) {
    this.validateApplicationType(type);
    await this.ensureCollegeExists(college_id);
    return Referral.findAll({
      where: { college_id, application_type: type },
      include: [],
    });
  }

  validateApplicationType(type) {
    if (!["self", "referred"].includes(type)) {
      const error = new Error("Invalid application type");
      error.status = 400;
      throw error;
    }
  }

  async ensureCollegeExists(college_id) {
    const college = await College.findByPk(college_id);
    if (!college) {
      const error = new Error("College not found");
      error.status = 404;
      throw error;
    }
  }

  async updateStatus(id, status, remarks = null) {
    const allowedStatuses = ["IN_PROGRESS", "ACCEPTED", "REJECTED"];
    if (!allowedStatuses.includes(status)) {
      const error = new Error("Invalid status value");
      error.status = 400;
      throw error;
    }

    const referral = await Referral.findByPk(id);

    if (!referral) {
      const error = new Error("Referral not found");
      error.status = 404;
      throw error;
    }

    referral.status = status;
    if (remarks !== null && remarks !== undefined) {
      referral.remarks = remarks;
    }
    await referral.save();

    return referral;
  }

  async deleteReferral(id, user = null) {
    const referral = await Referral.findByPk(id);

    if (!referral) {
      const error = new Error("Referral not found");
      error.status = 404;
      throw error;
    }

    // If user is provided, check if they own this referral (for students)
    if (user) {
      const userRoles = roleHelper(user?.role);
      // If user is a student (not admin/editor/agent), they can only delete their own referrals
      if (!userRoles?.admin && !userRoles?.editor && !userRoles?.agent) {
        if (referral.student_id !== user.id) {
          const error = new Error("You can only delete your own applications");
          error.status = 403;
          throw error;
        }
      }
    }

    await referral.destroy();
  }

  async getTopAgents(limit = 5) {
    // Fetch referral point from Config table
    const referralPointConfig = await Config.findOne({
      where: { type: "referral_point" },
    });

    // Default to 10 if not configured
    const referralPoint = referralPointConfig
      ? parseFloat(referralPointConfig.value) || 10
      : 10;

    // Use raw query to count referrals grouped by agent_id
    const agentStats = await sequelize.query(
      `
      SELECT 
        r.agent_id,
        COUNT(r.id) as referral_count
      FROM referral r
      WHERE r.agent_id IS NOT NULL 
        AND r.application_type = 'referred'
      GROUP BY r.agent_id
      ORDER BY referral_count DESC
      LIMIT :limit
      `,
      {
        replacements: { limit },
        type: QueryTypes.SELECT,
      }
    );

    // Get agent IDs and fetch user details
    const agentIds = agentStats.map((stat) => stat.agent_id);
    const agents = await UserModel.findAll({
      where: { id: { [Op.in]: agentIds } },
      attributes: ["id", "firstName", "lastName", "email"],
    });

    // Create a map for quick lookup
    const agentMap = new Map(agents.map((agent) => [agent.id, agent]));

    // Calculate scores and format response
    const topAgents = agentStats.map((stat) => {
      const referralCount = parseInt(stat.referral_count || 0);
      const totalScore = referralCount * referralPoint;
      const agent = agentMap.get(stat.agent_id);

      return {
        agent_id: stat.agent_id,
        agent: agent
          ? {
            id: agent.id,
            firstName: agent.firstName,
            lastName: agent.lastName,
            email: agent.email,
            fullName: `${agent.firstName || ""} ${agent.lastName || ""}`.trim(),
          }
          : null,
        referralCount,
        totalScore,
      };
    });

    return {
      topAgents,
      referralPoint,
    };
  }
}

export default ReferralService;
