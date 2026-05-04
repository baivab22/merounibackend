import ConsultancyApplication from "../../models/consultancy/ConsultancyApplication.model.js";
import Consultancy from "../../models/consultancy/Consultancy.model.js";
import User from "../../models/users/User.model.js";
import { sequelize } from "../../config/database.config.js";
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
      student_name:
        `${student.firstName} ${student.middleName || ""} ${student.lastName}`.trim(),
      student_phone_no: student.phoneNo,
      student_email: student.email,
      student_description,
      status: "IN_PROGRESS",
    });
  }

  async agentApplyToConsultancy(data, agent) {
    if (!agent || !agent.id) {
      const error = new Error("Authentication required");
      error.status = 401;
      throw error;
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      const error = new Error("Data array is required and cannot be empty");
      error.status = 400;
      throw error;
    }

    return await sequelize.transaction(async (t) => {
      const allResults = [];

      for (const payload of data) {
        const { consultancy_id, students } = payload;

        if (!consultancy_id) {
          const error = new Error(
            "Consultancy ID is required for each application batch",
          );
          error.status = 400;
          throw error;
        }

        if (!students || !Array.isArray(students) || students.length === 0) {
          const error = new Error(
            `At least one student is required for consultancy ID ${consultancy_id}`,
          );
          error.status = 400;
          throw error;
        }

        for (const studentData of students) {
          const {
            student_email,
            student_description,
            student_name,
            student_phone_no,
          } = studentData;

          // 2. Check if already applied
          const existing = await ConsultancyApplication.findOne({
            where: {
              consultancy_id,
              student_email,
            },
            transaction: t,
          });

          if (existing) {
            const error = new Error(
              `Student ${student_email} has already applied to consultancy ID ${consultancy_id}`,
            );
            error.status = 400;
            throw error;
          }

          // 3. Create application
          const application = await ConsultancyApplication.create(
            {
              consultancy_id,
              agent_id: agent.id,
              student_name:
                student_name ||
                `${student.firstName} ${student.lastName}`.trim(),
              student_phone_no: student_phone_no || student.phoneNo,
              student_email: student_email,
              student_description,
              status: "IN_PROGRESS",
            },
            { transaction: t },
          );

          allResults.push(application);
        }
      }

      return allResults;
    });
  }

  async checkIfStudentAppliedToConsultancy(consultancyId, studentId) {
    const existing = await ConsultancyApplication.findOne({
      where: {
        consultancy_id: consultancyId,
        student_id: studentId,
      },
    });
    if (existing) {
      return {
        hasApplied: true,
        applicationId: existing.id,
      };
    }
    return {
      hasApplied: false,
    };
  }
  async getUserApplications(user) {
    const whereCondition = {};
    const userRoles = roleHelper(user?.role);

    if (userRoles?.agent) {
      whereCondition.agent_id = user.id;
    } else {
      whereCondition.student_id = user.id;
    }

    return await ConsultancyApplication.findAll({
      where: whereCondition,
      include: [
        {
          model: Consultancy,
          as: "consultancy",
          attributes: ["title", "slugs", "logo", "address", "contact"],
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
    const userRoles = roleHelper(user?.role);

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
    const userRoles = roleHelper(user?.role);

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
