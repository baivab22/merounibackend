import ConsultancyApplication from "../../models/consultancy/ConsultancyApplication.model.js";
import Consultancy from "../../models/consultancy/Consultancy.model.js";
import User from "../../models/users/User.model.js";
import { roleHelper } from "../../utils/RoleHelper.js";

class ConsultancyApplicationService {
  async applyToConsultancy(payload, user) {
    const { consultancy_id, student_description } = payload;

    if (!consultancy_id) {
      const error = new Error("Consultancy ID is required");
      error.status = 400;
      throw error;
    }

    if (!user || !user.id) {
      const error = new Error("Authentication required");
      error.status = 401;
      throw error;
    }

    // Check if already applied
    const existing = await ConsultancyApplication.findOne({
      where: {
        consultancy_id,
        student_id: user.id,
      },
    });

    if (existing) {
      const error = new Error("You have already applied to this consultancy.");
      error.status = 400;
      throw error;
    }

    // Fetch student info
    const student = await User.findByPk(user.id);
    if (!student) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return await ConsultancyApplication.create({
      consultancy_id,
      student_id: user.id,
      student_name: `${student.firstName} ${student.middleName || ""} ${student.lastName}`.trim(),
      student_phone_no: student.phoneNo,
      student_email: student.email,
      student_description,
      status: "IN_PROGRESS",
    });
  }

  async getUserApplications(userId) {
    return await ConsultancyApplication.findAll({
      where: { student_id: userId },
      include: [
        {
          model: Consultancy,
          as: "consultancy",
          attributes: ["title", "slugs", "logo", "address", "contact"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getConsultancyApplications(consultancyId) {
    return await ConsultancyApplication.findAll({
      where: { consultancy_id: consultancyId },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["firstName", "lastName", "email", "phoneNo"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async listAllApplications() {
    return await ConsultancyApplication.findAll({
      include: [
        {
          model: Consultancy,
          as: "consultancy",
          attributes: ["title", "slugs", "logo"],
        },
        {
          model: User,
          as: "student",
          attributes: ["firstName", "lastName", "email", "phoneNo"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async updateStatus(id, status, remarks = null, user) {
    // Check if user has permission (consultancy owner or admin)
    const userRoles = roleHelper(user?.roles || user?.role);
    
    const application = await ConsultancyApplication.findByPk(id);
    if (!application) {
      const error = new Error("Application not found");
      error.status = 404;
      throw error;
    }

    // If consultancy role, check if it's their consultancy
    if (userRoles?.consultancy) {
      const dbUser = await User.findByPk(user.id);
      if (dbUser.consultancyId !== application.consultancy_id) {
        const error = new Error("Unauthorized to update this application");
        error.status = 403;
        throw error;
      }
    } else if (!userRoles?.admin && !userRoles?.editor) {
      const error = new Error("Unauthorized to update application status");
      error.status = 403;
      throw error;
    }

    const allowedStatuses = ["IN_PROGRESS", "ACCEPTED", "REJECTED"];
    if (!allowedStatuses.includes(status)) {
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
}

export default ConsultancyApplicationService;
