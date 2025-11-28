import { Op } from "sequelize";
import slug from "slug";

import Consultancy from "../../models/consultancy/Consultancy.model.js";
import Course from "../../models/courses/Course.model.js";

class ConsultancyService {
  async listConsultancy(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();
    const search = query.q || "";

    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    const { count: totalCount, rows: items } =
      await Consultancy.findAndCountAll({
        where: whereCondition,
        distinct: true,
        include: [
          {
            model: Course,
            as: "consultancyCourses",
            attributes: ["id", "title"],
            through: { attributes: [] },
          },
        ],
        limit,
        offset,
        order: [["id", sort]],
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

  async getConsultancy(slugs) {
    const consultancy = await Consultancy.findOne({
      where: { slugs },
      include: [
        {
          model: Course,
          as: "consultancyCourses",
          attributes: ["title"],
          through: { attributes: [] },
        },
      ],
    });

    if (!consultancy) {
      const error = new Error("Consultancy not found");
      error.status = 404;
      throw error;
    }

    return consultancy;
  }

  async createOrUpdateConsultancy(payload) {
    const {
      id,
      title,
      destination,
      address,
      featured_image,
      pinned,
      courses,
      status,
      visibility,
    } = payload;

    const slugs = slug(title);
    const parsedCourses =
      typeof courses === "string" ? JSON.parse(courses) : courses;

    if (!Array.isArray(parsedCourses)) {
      const error = new Error("Courses should be an array");
      error.status = 400;
      throw error;
    }

    for (const courseId of parsedCourses) {
      const courseExists = await Course.findByPk(courseId);
      if (!courseExists) {
        const error = new Error(`Invalid course ID: ${courseId}`);
        error.status = 400;
        throw error;
      }
    }

    let consultancy;

    if (id) {
      consultancy = await Consultancy.findByPk(id);
      if (!consultancy) {
        const error = new Error("Consultancy not found");
        error.status = 404;
        throw error;
      }
      await consultancy.update({
        title,
        slugs,
        destination,
        address,
        featured_image,
        pinned,
        status,
        visibility,
      });
    } else {
      consultancy = await Consultancy.create({
        title,
        slugs,
        destination,
        address,
        featured_image,
        pinned,
        status,
        visibility,
      });
    }

    await consultancy.setConsultancyCourses(parsedCourses);

    return consultancy;
  }

  async deleteConsultancy(id) {
    const consultancy = await Consultancy.findByPk(id);
    if (!consultancy) {
      const error = new Error("Consultancy not found");
      error.status = 404;
      throw error;
    }

    await consultancy.destroy();
  }
}

export default ConsultancyService;
