import { Op } from "sequelize";
import slug from "slug";

import Faculty from "../../models/faculty/Faculty.model.js";
import UserModel from "../../models/users/User.model.js";

class FacultyService {
  async listFaculty(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();
    const search = query.q || "";

    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    const { count: totalCount, rows: items } = await Faculty.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      attributes: {
        exclude: ["author"],
      },
      include: [
        {
          model: UserModel,
          as: "authorDetails",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
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

  async getFaculty(slugs) {
    const faculty = await Faculty.findOne({
      where: { slugs },
    });
    if (!faculty) {
      const error = new Error("Faculty not found");
      error.status = 404;
      throw error;
    }
    return faculty;
  }

  async createFaculty(data) {
    const { title, description, featured_image, author } = data;

    // Generate slug from title (title is already validated by the validator)
    const generatedSlug = slug(title);

    await Faculty.create({
      title,
      slugs: generatedSlug,
      description,
      author,
      featured_image,
    });
  }

  async updateFaculty(faculty_id, data) {
    const faculty = await Faculty.findByPk(faculty_id);

    if (!faculty) {
      const error = new Error("Faculty not found");
      error.status = 404;
      throw error;
    }

    let updatedSlug = faculty.slugs;
    if (data.title && data.title !== faculty.title) {
      // Validate title
      if (data.title.trim() === "") {
        const error = new Error("Title cannot be empty");
        error.status = 400;
        throw error;
      }
      updatedSlug = slug(data.title);
    }

    const [updatedCount] = await Faculty.update(
      { ...data, slugs: updatedSlug },
      {
        where: { id: faculty_id },
      }
    );

    if (updatedCount === 0) {
      const error = new Error("Faculty already up to date");
      error.status = 404;
      throw error;
    }
  }

  async deleteFaculty(id) {
    const deletedRows = await Faculty.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Faculty not found");
      error.status = 404;
      throw error;
    }
  }
}

export default FacultyService;
