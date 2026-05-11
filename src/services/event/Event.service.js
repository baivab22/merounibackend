import { Op, literal } from "sequelize";
import slugify from "slug";
import { getUniqueSlug } from "../../utils/SlugHelper.js";
import moment from "moment";

import { sequelize } from "../../config/database.config.js";
import Event from "../../models/events/Event.model.js";
import Category from "../../models/category/Category.model.js";
import UserModel from "../../models/users/User.model.js";
import College from "../../models/college/College.model.js";

class EventService {
  async createOrUpdateEvent(payload) {
    const transaction = await sequelize.transaction();
    try {
      const {
        id,
        title,
        description,
        meta_description,
        content,
        image,
        category_id,
        is_featured,
        college_id,
        author_id,
        event_host,
        status,
        slug,
        customSlugs,
      } = payload;

      let eventId = id;
      let finalSlug;
      finalSlug = await getUniqueSlug(Event, title, id, customSlugs || slug);

      if (!eventId) {
        // Create new event - all required fields should be present
        const maxOrder = await Event.max("order_no_for_website");
        const event = await Event.create(
          {
            title,
            slug: finalSlug,
            description,
            meta_description,
            content,
            image,
            is_featured: is_featured ?? 0,
            category_id,
            college_id,
            author_id,
            event_host,
            status: status || "published",
            order_no_for_website: (maxOrder || 0) + 1,
          },
          { transaction },
        );
        eventId = event.id;
      } else {
        // Update existing event - only update provided fields
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (meta_description !== undefined)
          updateData.meta_description = meta_description;
        if (content !== undefined) updateData.content = content;
        if (image !== undefined) updateData.image = image;
        if (is_featured !== undefined) updateData.is_featured = is_featured;
        if (category_id !== undefined) updateData.category_id = category_id;
        if (college_id !== undefined) updateData.college_id = college_id;
        if (author_id !== undefined) updateData.author_id = author_id;
        if (event_host !== undefined) updateData.event_host = event_host;
        if (status !== undefined) updateData.status = status;
        if (finalSlug) {
          updateData.slug = finalSlug;
        }

        if (Object.keys(updateData).length > 0) {
          await Event.update(updateData, {
            where: { id: eventId },
            transaction,
          });
        }
      }

      await transaction.commit();
      return {
        eventId,
        isNew: !id,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteEvent(event_id) {
    const event = await Event.findByPk(event_id);
    if (!event) {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }

    await event.destroy();
  }

  async getEvent(slug) {
    const item = await Event.findOne({
      where: { slug },
      attributes: {
        exclude: ["category_id", "college_id", "author_id"],
      },
      include: [
        { model: Category, as: "category", attributes: ["title", "slug"] },
        {
          model: UserModel,
          as: "author",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: College,
          as: "college",
          attributes: ["name", "slug"],
        },
      ],
    });

    if (!item) {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }

    if (item.event_host) {
      item.event_host = JSON.parse(JSON.stringify(item.event_host));
    }

    return item;
  }

  async listEvents(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();
    const offset = (page - 1) * limit;
    const isFeatured = query.is_featured;
    const search = query.q || "";
    const collegeId = query.college_id;
    const categoryId = query.category_id;
    const status = query.status;

    const whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (isFeatured !== undefined) {
      whereCondition.is_featured = isFeatured === "true" ? 1 : 0;
    }

    if (collegeId) {
      whereCondition.college_id = collegeId;
    }

    if (categoryId) {
      whereCondition.category_id = categoryId;
    }

    if (status && status !== "all") {
      whereCondition.status = status;
    }

    const { count: totalCount, rows: items } = await Event.findAndCountAll({
      where: whereCondition,
      distinct: true,
      limit,
      offset,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "title", "slug"],
        },
      ],
      order: [
        ["order_no_for_website", "ASC"],
        ["id", "DESC"],
      ],
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

  async getUnExpiredEvents(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const dateLiteral = literal(`
      STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') 
      >= CURDATE()
    `);

    const whereCondition = { [Op.and]: [dateLiteral] };
    if (query.college_id) {
      whereCondition.college_id = query.college_id;
    }

    const totalCount = await Event.count({
      where: whereCondition,
    });

    const events = await Event.findAll({
      where: whereCondition,
      limit,
      offset,
      order: [
        literal(
          `STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') ASC`,
        ),
      ],
      subQuery: false,
    });

    return {
      events,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async getThisWeekEvents(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Get start of current week (Monday) and end of current week (Sunday)
    const startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = moment().endOf("week").format("YYYY-MM-DD");

    const dateLiteral = literal(`
      STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') 
      >= STR_TO_DATE('${startOfWeek}', '%Y-%m-%d')
      AND STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') 
      <= STR_TO_DATE('${endOfWeek}', '%Y-%m-%d')
    `);

    const whereCondition = { [Op.and]: [dateLiteral] };
    if (query.college_id) {
      whereCondition.college_id = query.college_id;
    }

    const totalCount = await Event.count({
      where: whereCondition,
    });

    const events = await Event.findAll({
      where: whereCondition,
      limit,
      offset,
      order: [
        literal(
          `STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') ASC`,
        ),
      ],
      subQuery: false,
    });

    return {
      events,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async getNextMonthEvents(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Get start of next month (first day) and end of next month (last day)
    const startOfNextMonth = moment()
      .add(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfNextMonth = moment()
      .add(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");

    const dateLiteral = literal(`
      STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') 
      >= STR_TO_DATE('${startOfNextMonth}', '%Y-%m-%d')
      AND STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') 
      <= STR_TO_DATE('${endOfNextMonth}', '%Y-%m-%d')
    `);

    const whereCondition = { [Op.and]: [dateLiteral] };
    if (query.college_id) {
      whereCondition.college_id = query.college_id;
    }

    const totalCount = await Event.count({
      where: whereCondition,
    });

    const events = await Event.findAll({
      where: whereCondition,
      limit,
      offset,
      order: [
        literal(
          `STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') ASC`,
        ),
      ],
      subQuery: false,
    });

    return {
      events,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async updateEventOrder(events) {
    const transaction = await sequelize.transaction();
    try {
      const eventIds = events.map((e) => e.id);
      const existingEvents = await Event.findAll({
        where: { id: { [Op.in]: eventIds } },
        transaction,
      });

      if (existingEvents.length !== eventIds.length) {
        const error = new Error("Invalid event IDs");
        error.status = 400;
        throw error;
      }

      const updates = events.map((event) =>
        Event.update(
          { order_no_for_website: event.order_no },
          { where: { id: event.id }, transaction },
        ),
      );

      await Promise.all(updates);
      await transaction.commit();

      return { message: "Event order updated successfully" };
    } catch (error) {
      console.error("Error in updateEventOrder service:", error);
      await transaction.rollback();
      throw error;
    }
  }
}

export default EventService;
