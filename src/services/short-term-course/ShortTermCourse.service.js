import { Op } from "sequelize";
import ShortTermCourse from "../../models/short-term-courses/ShortTermCourse.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";
import StudentMembership from "../../models/student-membership/StudentMembership.model.js";

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return ["true", "1", "yes", "on"].includes(String(value).trim().toLowerCase());
};

class ShortTermCourseService {
  async _resolveAccess({ userId = null, isStaff = false } = {}) {
    if (isStaff) {
      return { userId, hasPremiumAccess: true };
    }

    if (!userId) {
      return { userId: null, hasPremiumAccess: false };
    }

    const membership = await StudentMembership.findOne({
      where: { student_id: userId, status: "APPROVED" },
      attributes: ["id"],
      order: [["createdAt", "DESC"]],
    });

    return { userId, hasPremiumAccess: Boolean(membership) };
  }

  _formatCourse(course, access = {}) {
    const plain = course instanceof ShortTermCourse ? course.get({ plain: true }) : course;
    const is_premium = Boolean(plain.is_premium);
    const canAccess = !is_premium || Boolean(access.hasPremiumAccess);

    return {
      ...plain,
      is_premium,
      is_locked: is_premium && !canAccess,
      has_access: canAccess,
    };
  }

  async listCourses(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { q, status, location, duration, type, price } = query;
    const whereCondition = {};

    if (q) {
      whereCondition.title = { [Op.like]: `%${q}%` };
    }

    if (status) {
      whereCondition.status = status;
    }

    if (location) {
      whereCondition.location = { [Op.like]: `%${location}%` };
    }

    if (duration) {
      whereCondition.duration = duration;
    }

    if (type) {
      whereCondition.course_type = type;
    }

    if (price) {
      whereCondition.price = price;
    }

    const access = await this._resolveAccess({
      userId: query.userId,
      isStaff: query.isStaff,
    });

    const { count: totalCount, rows: items } =
      await ShortTermCourse.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    return {
      items: items.map((item) => this._formatCourse(item, access)),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getCourseById(id, options = {}) {
    const access = await this._resolveAccess(options);
    const course = await ShortTermCourse.findByPk(id);

    if (!course) {
      const error = new Error("Short Term Course not found");
      error.status = 404;
      throw error;
    }

    const formatted = this._formatCourse(course, access);
    if (formatted.is_premium && !access.hasPremiumAccess) {
      return formatted;
    }

    return formatted;
  }

  async getCourseBySlug(slug, options = {}) {
    const access = await this._resolveAccess(options);
    const course = await ShortTermCourse.findOne({
      where: { slug },
    });

    if (!course) {
      const error = new Error("Short Term Course not found");
      error.status = 404;
      throw error;
    }

    const formatted = this._formatCourse(course, access);
    if (formatted.is_premium && !access.hasPremiumAccess) {
      return formatted;
    }

    return formatted;
  }

  async createCourse(payload) {
    const { title, ...rest } = payload;
    const slug = payload.slug || generateUniqueSlug(title);

    return ShortTermCourse.create({
      ...rest,
      title,
      slug,
      meta_description: payload.meta_description,
      is_premium: toBoolean(rest.is_premium, false),
    });
  }

  async updateCourse(id, payload) {
    const course = await ShortTermCourse.findByPk(id);
    if (!course) {
      const error = new Error("Short Term Course not found");
      error.status = 404;
      throw error;
    }

    const { title, ...rest } = payload;
    const updateData = { ...rest };

    if (title && title !== course.title) {
      updateData.title = title;
      if (!payload.slug) {
        updateData.slug = generateUniqueSlug(title);
      }
    }

    if (payload.slug) {
      updateData.slug = payload.slug;
    }

    if (payload.meta_description !== undefined) {
      updateData.meta_description = payload.meta_description;
    }

    if (rest.is_premium !== undefined) {
      updateData.is_premium = toBoolean(rest.is_premium, false);
    }

    await course.update(updateData);
    return course;
  }

  async deleteCourse(id) {
    const deletedRows = await ShortTermCourse.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Short Term Course not found");
      error.status = 404;
      throw error;
    }
  }
}

export default ShortTermCourseService;
