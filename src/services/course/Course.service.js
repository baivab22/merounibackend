import { Op } from "sequelize";
import slug from "slug";

import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import Course from "../../models/courses/Course.model.js";
import FacultyModel from "../../models/faculty/Faculty.model.js";
import { University } from "../../models/university/University.model.js";
import UserModel from "../../models/users/User.model.js";

class CourseService {
  async listCourses(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const {
      q,
      credits,
      duration,
      faculty,
      level,
      orgType,
      district,
      discipline,
      degree,
      foreignAffiliation,
      distantLearning,
    } = query;

    const whereCondition = {};
    const include = [];

    // Search by title
    if (q) {
      whereCondition.title = { [Op.like]: `%${q}%` };
    }

    // Credits filter
    if (credits) {
      if (credits.includes("-")) {
        const [minCredits, maxCredits] = credits.split("-").map(Number);
        whereCondition.credits = { [Op.between]: [minCredits, maxCredits] };
      } else {
        whereCondition.credits = parseInt(credits, 10);
      }
    }

    // Duration filter
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

    // Faculty/Discipline filter
    const disciplineFilter = discipline || faculty;
    if (disciplineFilter) {
      include.push({
        model: FacultyModel,
        as: "coursefaculty",
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${disciplineFilter}%` } },
            { slugs: disciplineFilter },
          ],
        },
      });
    } else {
      include.push({
        model: FacultyModel,
        as: "coursefaculty",
        attributes: ["title", "slugs"],
      });
    }

    // College and related filters (Org Type, District, Foreign Affiliation)
    const collegeWhere = {};
    if (orgType) {
      collegeWhere.institute_type = orgType;
    }

    const hasCollegeFilter = orgType || district || foreignAffiliation;
    const universityWhere = {};
    if (foreignAffiliation === "true") {
      universityWhere.country = { [Op.ne]: "Nepal" };
    }

    const addressWhere = {};
    if (district) {
      addressWhere[Op.or] = [
        { city: { [Op.like]: `%${district}%` } },
        { state: { [Op.like]: `%${district}%` } },
      ];
    }

    const { count: totalCount, rows: items } = await Course.findAndCountAll({
      where: whereCondition,
      include: include.length > 0 ? include : undefined,
      distinct: true,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      subQuery: false,
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
