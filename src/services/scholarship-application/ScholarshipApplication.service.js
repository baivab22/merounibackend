import ScholarshipApplication from "../../models/scholarship-application/ScholarshipApplication.model.js";
import Scholarship from "../../models/scholarship/Scholarship.model.js";
import UserModel from "../../models/users/User.model.js";
import Category from "../../models/category/Category.model.js";
import { Op } from "sequelize";

class ScholarshipApplicationService {
  async applyForScholarship(studentId, scholarshipId) {
    // Check if scholarship exists
    const scholarship = await Scholarship.findByPk(scholarshipId);
    if (!scholarship) {
      const error = new Error("Scholarship not found");
      error.status = 404;
      throw error;
    }

    // Check if student exists
    const student = await UserModel.findByPk(studentId);
    if (!student) {
      const error = new Error("Student not found");
      error.status = 404;
      throw error;
    }

    // Check if application already exists
    const existingApplication = await ScholarshipApplication.findOne({
      where: {
        scholarship_id: scholarshipId,
        student_id: studentId,
      },
    });

    if (existingApplication) {
      const error = new Error("You have already applied for this scholarship");
      error.status = 400;
      throw error;
    }

    // Check if deadline has passed
    const now = new Date();
    const deadline = new Date(scholarship.applicationDeadline);
    if (now > deadline) {
      const error = new Error("Application deadline has passed");
      error.status = 400;
      throw error;
    }

    // Create application
    const application = await ScholarshipApplication.create({
      scholarship_id: scholarshipId,
      student_id: studentId,
      status: "PENDING",
    });

    return application;
  }

  async getStudentApplications(studentId, query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereCondition = {
      student_id: studentId,
    };

    if (query.status) {
      whereCondition.status = query.status;
    }

    const { count, rows } = await ScholarshipApplication.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Scholarship,
          as: "scholarship",
          include: [
            {
              model: Category,
              as: "scholarshipCategory",
              attributes: ["id", "title", "slugs"],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      applications: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    };
  }

  async getAllApplications(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (query.status) {
      whereCondition.status = query.status;
    }

    if (query.scholarshipId) {
      whereCondition.scholarship_id = query.scholarshipId;
    }

    if (query.studentId) {
      whereCondition.student_id = query.studentId;
    }

    const { count, rows } = await ScholarshipApplication.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Scholarship,
          as: "scholarship",
          include: [
            {
              model: Category,
              as: "scholarshipCategory",
              attributes: ["id", "title", "slugs"],
            },
          ],
        },
        {
          model: UserModel,
          as: "student",
          attributes: ["id", "firstName", "middleName", "lastName", "email", "phoneNo"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      applications: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    };
  }

  async updateApplicationStatus(applicationId, status, remarks = null) {
    const application = await ScholarshipApplication.findByPk(applicationId);
    if (!application) {
      const error = new Error("Application not found");
      error.status = 404;
      throw error;
    }

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      const error = new Error("Invalid status");
      error.status = 400;
      throw error;
    }

    application.status = status;
    if (remarks !== null) {
      application.remarks = remarks;
    }
    await application.save();

    return application;
  }

  async deleteApplication(applicationId, studentId) {
    const application = await ScholarshipApplication.findByPk(applicationId);
    if (!application) {
      const error = new Error("Application not found");
      error.status = 404;
      throw error;
    }

    // Check if the application belongs to the student
    if (application.student_id !== studentId) {
      const error = new Error("You can only delete your own applications");
      error.status = 403;
      throw error;
    }

    await application.destroy();
    return { message: "Application deleted successfully" };
  }
}

export default ScholarshipApplicationService;
