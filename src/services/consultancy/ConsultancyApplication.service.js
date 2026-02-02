import ConsultancyApplication from "../../models/consultancy/ConsultancyApplication.model.js";
import Consultancy from "../../models/consultancy/Consultancy.model.js";
import User from "../../models/users/User.model.js";
import { roleHelper } from "../../utils/RoleHelper.js";
import { Op } from "sequelize";

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


  async listAllApplications(query) {
    const { page = 1, limit = 10, search, status, consultancy_id } = query;

    const pageNumber = Number(page);
    const pageLimit = Number(limit);
    const offset = (pageNumber - 1) * pageLimit;

    const where = {};

    if (search) {
      where[Op.or] = [
        { student_name: { [Op.like]: `%${search}%` } },
        { student_email: { [Op.like]: `%${search}%` } },
        { student_phone_no: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (consultancy_id) {
      where.consultancy_id = consultancy_id;
    }

    const { rows, count: totalCount } =
      await ConsultancyApplication.findAndCountAll({
        where,
        include: [
          {
            model: Consultancy,
            as: "consultancy",
            attributes: ["title", "slugs", "logo"],
          },
          {
            model: User,
            as: "student",
            attributes: ["id", "firstName", "lastName", "email", "phoneNo"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: pageLimit,
        offset,
      });

    return {
      data: rows,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / pageLimit),
        limit: pageLimit,
        totalCount,
      },
    };
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

  async deleteApplication(id, user) {
    const userRoles = roleHelper(user?.roles || user?.role);

    const application = await ConsultancyApplication.findByPk(id);
    if (!application) {
      const error = new Error("Application not found");
      error.status = 404;
      throw error;
    }

    // Authorization
    let isAuthorized = false;

    if (userRoles.admin || userRoles.editor) {
      isAuthorized = true;
    } else if (application.student_id === user.id) {
      isAuthorized = true;
    } else if (userRoles.consultancy) {
      // Check if this application belongs to the consultancy
      const dbUser = await User.findByPk(user.id);
      if (dbUser.consultancyId === application.consultancy_id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      const error = new Error("Unauthorized to delete this application");
      error.status = 403;
      throw error;
    }

    await application.destroy();
    return { message: "Application deleted successfully" };
  }
}

export default ConsultancyApplicationService;
