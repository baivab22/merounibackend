import { Op, Sequelize } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import slug from "slug";

import Consultancy from "../../models/consultancy/Consultancy.model.js";
import Course from "../../models/courses/Course.model.js";
import UserModel from "../../models/users/User.model.js";

class ConsultancyService {
  async listConsultancy(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "desc").toUpperCase();
    const search = query.q || "";

    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }


    const includeOptions = [
      {
        model: Course,
        as: "consultancyCourses",
        attributes: ["id", "title"],
        through: { attributes: [] },
      },
    ];

    if (query.courseId) {
      includeOptions[0].where = { id: query.courseId };
    }



    const { count: totalCount, rows: items } =
      await Consultancy.findAndCountAll({
        where: whereCondition,
        distinct: true,
        include: includeOptions,
        limit,
        offset,
        order: [
          [Sequelize.literal("order_no_for_website IS NULL"), "ASC"],
          ["order_no_for_website", "ASC"],
          ["createdAt", sort],
        ],
      });
    const consultancyIds = items.map((consultancy) => consultancy.id);


    const usersWithConsultancyId = await UserModel.findAll({
      where: {
        consultancyId: { [Op.in]: consultancyIds },
      },
      attributes: ["consultancyId", "roles"],
      raw: true,
    });

    const consultanciesWithAccounts = new Set(
      usersWithConsultancyId
        .filter((user) => {
          try {
            const roles =
              typeof user.roles === "string"
                ? JSON.parse(user.roles)
                : user.roles;
            return roles?.consultancy === true && user.consultancyId;
          } catch {
            return false;
          }
        })
        .map((user) => user.consultancyId)
        .filter(Boolean)
    );



    // Add has_account field to each consultancy item
    const itemsWithAccountStatus = items.map((consultancy) => {
      const consultancyData = consultancy.toJSON ? consultancy.toJSON() : consultancy;
      return {
        ...consultancyData,
        has_account: consultanciesWithAccounts.has(consultancy.id),
      };
    });

    return {
      items: itemsWithAccountStatus,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getMyConsultancy(userId) {
    const consultancyUser = await UserModel.findOne({
      where: { id: userId },

    });

    if (!consultancyUser) {
      const error = new Error("Consultancy not found");
      error.status = 404;
      throw error;
    }

    const consultancy = await Consultancy.findOne({
      where: { id: consultancyUser.consultancyId },
    });

    if (!consultancy) {
      const error = new Error("Consultancy not found");
      error.status = 404;
      throw error;
    }

    return consultancy;
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
      logo,
      description,
      meta_description,
      contact,
      website_url,
      google_map_url,
      video_url,
      pinned,
      courses,
      status,
      visibility,
      map_type,
    } = payload;


    // Validate title for create operation
    if (!id && !title) {
      const error = new Error("Title is required for creating consultancy");
      error.status = 400;
      throw error;
    }

    // Generate slug only if title is provided
    const slugs = title ? slug(title) : null;

    // Parse courses - handle string, array, or undefined/null
    let parsedCourses = [];
    if (courses !== undefined && courses !== null) {
      if (typeof courses === "string") {
        try {
          parsedCourses = courses.trim() ? JSON.parse(courses) : [];
        } catch (e) {
          parsedCourses = [];
        }
      } else if (Array.isArray(courses)) {
        parsedCourses = courses;
      }
    }

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

      // Build update object, include all fields (handle empty strings as null for optional fields)
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (destination !== undefined) updateData.destination = destination;
      // Map address fields if provided
      if (address !== undefined && typeof address === "object" && address !== null) {
        updateData.address = address;
        if (address.city) updateData.city = address.city;
        if (address.state) updateData.state = address.state;
        if (address.street) updateData.street = address.street;
        if (address.country) updateData.country = address.country;
        // Update location summary string
        updateData.location = [address.city, address.state, address.country]
          .filter(Boolean)
          .join(", ");
      }
      if (featured_image !== undefined)
        updateData.featured_image = featured_image;
      // Handle logo - empty string or null becomes null
      if (logo !== undefined)
        updateData.logo = logo === "" || logo === null ? null : logo;
      // Handle description - empty string or null becomes null
      if (description !== undefined)
        updateData.description =
          description === "" || description === null ? null : description;
      if (meta_description !== undefined)
        updateData.meta_description =
          meta_description === "" || meta_description === null ? null : meta_description;
      if (contact !== undefined) updateData.contact = contact || [];
      // Handle website_url - empty string or null becomes null
      if (website_url !== undefined)
        updateData.website_url =
          website_url === "" || website_url === null ? null : website_url;
      // Handle google_map_url - empty string or null becomes null
      if (google_map_url !== undefined)
        updateData.google_map_url =
          google_map_url === "" || google_map_url === null
            ? null
            : google_map_url;
      // Handle video_url - empty string or null becomes null
      if (video_url !== undefined)
        updateData.video_url =
          video_url === "" || video_url === null ? null : video_url;
      if (pinned !== undefined) updateData.pinned = pinned;
      if (status !== undefined) updateData.status = status;
      if (visibility !== undefined) updateData.visibility = visibility;
      if (map_type !== undefined) updateData.map_type = map_type;

      await consultancy.update(updateData);

    } else {
      // Extract individual address components for creation
      const city = address?.city || null;
      const state = address?.state || null;
      const street = address?.street || null;
      const country_field = address?.country || null;
      const location_summary = [city, state, country_field].filter(Boolean).join(", ");

      // For create, handle empty strings and undefined as null for optional fields
      consultancy = await Consultancy.create({
        title,
        slugs,
        destination: destination || [],
        address: address || {},
        location: location_summary,
        city,
        state,
        street,
        country: country_field,
        featured_image: featured_image || "",
        logo: logo === "" || logo === null || logo === undefined ? null : logo,
        map_type,
        description:
          description === "" ||
            description === null ||
            description === undefined
            ? null
            : description,
        meta_description:
          meta_description === "" ||
            meta_description === null ||
            meta_description === undefined
            ? null
            : meta_description,
        contact: contact || [],
        website_url:
          website_url === "" ||
            website_url === null ||
            website_url === undefined
            ? null
            : website_url,
        google_map_url:
          google_map_url === "" ||
            google_map_url === null ||
            google_map_url === undefined
            ? null
            : google_map_url,
        video_url:
          video_url === "" || video_url === null || video_url === undefined
            ? null
            : video_url,
        pinned: pinned !== undefined ? pinned : 0,
        status: status || "published",
        visibility: visibility || "public",
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

  async updateConsultancyOrder(consultancies) {
    const transaction = await sequelize.transaction();
    try {
      const consultancyIds = consultancies.map((c) => c.id);
      const existingConsultancies = await Consultancy.findAll({
        where: { id: { [Op.in]: consultancyIds } },
        transaction,
      });

      if (existingConsultancies.length !== consultancyIds.length) {
        throw new Error("Invalid consultancy IDs");
      }

      const updates = consultancies.map((c) =>
        Consultancy.update(
          { order_no_for_website: c.order_no },
          { where: { id: c.id }, transaction }
        )
      );

      await Promise.all(updates);
      await transaction.commit();
      return { message: "Consultancy order updated successfully" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default ConsultancyService;
