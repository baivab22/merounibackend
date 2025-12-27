import Referral from "../../models/referral/Referral.model.js";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import CollegeContact from "../../models/college/CollegeContact.model.js";
import UserModel from "../../models/users/User.model.js";
import Course from "../../models/courses/Course.model.js";
import { roleHelper } from "../../utils/RoleHelper.js";

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
          course_id: student.course_id || null,
          status: "IN_PROGRESS",
        });
      }
    }
  }

  async createSelfApplication(payload) {
    const { student_id, referral_type, college_id, course_id, description } =
      payload;

    // Ensure user exists
    const user = await UserModel.findByPk(student_id);

    if (!user) {
      const error = new Error("Student not found");
      error.status = 404;
      throw error;
    }

    // Optional: prevent duplicate self applications for same college & student
    const existing = await Referral.findOne({
      where: {
        college_id,
        student_id,
        application_type: "self",
      },
    });

    if (existing) {
      const error = new Error("You have already applied to this college.");
      error.status = 400;
      throw error;
    }

    return Referral.create({
      college_id,
      student_id,
      student_name: `${user.firstName} ${user.middleName || ""} ${
        user.lastName || ""
      }`.trim(),
      student_phone_no: user.phoneNo,
      student_email: user.email,
      student_description: description,
      course_id,
      application_type: referral_type || "self",
      status: "IN_PROGRESS",
    });
  }

  async getApplications(user) {
    const whereCondition = {};

    const userRoles = roleHelper(user?.role);

    if (userRoles?.agent) {
      whereCondition.agent_id = user.id;
    }

    return Referral.findAll({
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
          model: Course,
          as: "course",
          attributes: ["id", "title"],
        },
      ],
    });
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
              attributes: ["country", "state", "city", "street", "postal_code"],
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
          model: Course,
          as: "course",
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
          model: Course,
          as: "course",
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
    const collegeId = fullUser.collegeId || fullUser.college_id;

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
          model: Course,
          as: "course",
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

  async deleteReferral(id) {
    const referral = await Referral.findByPk(id);

    if (!referral) {
      const error = new Error("Referral not found");
      error.status = 404;
      throw error;
    }

    await referral.destroy();
  }
}

export default ReferralService;
