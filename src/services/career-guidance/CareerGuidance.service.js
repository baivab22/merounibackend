import { Op } from "sequelize";
import CareerGuidance from "../../models/career-guidance/CareerGuidance.model.js";

class CareerGuidanceService {
  async listSubmissions(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { q, status } = query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (q) {
      where[Op.or] = [
        { fullname: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { phone: { [Op.like]: `%${q}%` } },
        { desired_course: { [Op.like]: `%${q}%` } },
      ];
    }

    const { count: totalCount, rows: items } =
      await CareerGuidance.findAndCountAll({
        where,
        limit,
        offset,
        distinct: true,
        order: [["createdAt", "DESC"]],
      });

    return {
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async createSubmission(data) {
    return CareerGuidance.create(data);
  }

  async updateStatus(id, status) {
    const submission = await CareerGuidance.findByPk(id);
    if (!submission) {
      const error = new Error("Submission not found");
      error.status = 404;
      throw error;
    }
    submission.status = status;
    await submission.save();
    return submission;
  }

  async deleteSubmission(id) {
    const submission = await CareerGuidance.findByPk(id);
    if (!submission) {
      const error = new Error("Submission not found");
      error.status = 404;
      throw error;
    }
    await submission.destroy();
    return submission;
  }
}

export default CareerGuidanceService;
