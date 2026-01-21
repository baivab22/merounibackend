import { Op } from "sequelize";
import slug from "slug";

import Course from "../../models/courses/Course.model.js";
import UserModel from "../../models/users/User.model.js";
import FacultyModel from "../../models/faculty/Faculty.model.js";

class CourseService {
  async listCourses(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const search = query.q || "";
    const credits = query.credits || "";
    const duration = query.duration || "";
    const faculty = query.faculty || "";

    const whereCondition = {};

    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (faculty) {
      const facultyItem = await FacultyModel.findOne({
        where: { title: faculty },
      });

      if (facultyItem) {
        whereCondition.facultyId = facultyItem.id;
      }
    }

    if (credits) {
      if (credits.includes("-")) {
        const [minCredits, maxCredits] = credits.split("-").map(Number);
        whereCondition.credits = { [Op.between]: [minCredits, maxCredits] };
      } else {
        whereCondition.credits = parseInt(credits, 10);
      }
    }

    if (duration) {
      if (duration.includes("-")) {
        const [minDuration, maxDuration] = duration.split("-").map(Number);
        whereCondition.duration = {
          [Op.between]: [minDuration, maxDuration],
        };
      } else {
        whereCondition.duration = parseInt(duration, 10);
      }
    }

    const { count: totalCount, rows: items } = await Course.findAndCountAll({
      where: whereCondition,
      distinct: true,
      limit,
      offset,
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

  async getCourse(slugs) {
    const course = await Course.findOne({
      where: { slugs },
      attributes: {
        exclude: ["authorId", "facultyId"],
      },
      include: [
        {
          model: UserModel,
          as: "courseauthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: FacultyModel,
          as: "coursefaculty",
          attributes: ["title", "slugs"],
        },
      ],
    });

    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    return course;
  }

  async createOrUpdateCourse(payload) {
    const { id, title, ...rest } = payload;

    // Generate slug from title if provided, otherwise throw error
    const slugs = title ? slug(title) : undefined;

    if (!id) {
      if (!title) {
        const error = new Error("Title is required to create a course");
        error.status = 400;
        throw error;
      }
      return Course.create({ ...rest, title, slugs });
    }

    const course = await Course.findByPk(id);
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    // Only update title and slugs if provided
    const updateData = { ...rest };
    if (title) {
      updateData.title = title;
      updateData.slugs = slugs;
    }

    await Course.update(updateData, { where: { id } });
    return course;
  }

  async deleteCourse(id) {
    const deletedRows = await Course.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
  }
}

export default CourseService;
