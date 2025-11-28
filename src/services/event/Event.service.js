import { Op, literal } from "sequelize";
import slug from "slug";
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
        content,
        image,
        category_id,
        is_featured,
        college_id,
        author_id,
        event_host,
      } = payload;

      let eventId = id;
      const slugs = slug(title);

      if (!eventId) {
        const event = await Event.create(
          {
            title,
            slugs,
            description,
            content,
            image,
            is_featured,
            category_id,
            college_id,
            author_id,
            event_host,
          },
          { transaction }
        );
        eventId = event.id;
      } else {
        await Event.update(
          {
            title,
            slugs,
            description,
            content,
            image,
            is_featured,
            category_id,
            college_id,
            author_id,
            event_host,
          },
          { where: { id: eventId }, transaction }
        );
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

  async getEvent(slugs) {
    const item = await Event.findOne({
      where: { slugs },
      attributes: {
        exclude: ["category_id", "college_id", "author_id"],
      },
      include: [
        { model: Category, as: "category", attributes: ["title", "slugs"] },
        {
          model: UserModel,
          as: "author",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: College,
          as: "college",
          attributes: ["name", "slugs"],
        },
      ],
    });

    if (!item) {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }

    if (item.event_host) {
      item.event_host = JSON.parse(item.event_host);
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

    const whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (isFeatured !== undefined) {
      whereCondition.is_featured = isFeatured === "true" ? 1 : 0;
    }

    const { count: totalCount, rows: items } = await Event.findAndCountAll({
      where: whereCondition,
      distinct: true,
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

  async listEventsThisWeek(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const startOfWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
    const endOfWeek = moment().endOf("isoWeek").format("YYYY-MM-DD");

    const dateLiteral = literal(`
      STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') 
      BETWEEN '${startOfWeek}' AND '${endOfWeek}'
    `);

    const totalCount = await Event.count({
      where: dateLiteral,
    });

    const events = await Event.findAll({
      where: dateLiteral,
      limit,
      offset,
      order: [
        literal(
          `STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') ASC`
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

  async listEventsNextMonth(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const startOfNextMonth = moment()
      .add(1, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfNextMonth = moment()
      .add(1, "months")
      .endOf("month")
      .format("YYYY-MM-DD");

    const dateLiteral = literal(`
      STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') 
      BETWEEN '${startOfNextMonth}' AND '${endOfNextMonth}'
    `);

    const totalCount = await Event.count({
      where: dateLiteral,
    });

    const events = await Event.findAll({
      where: dateLiteral,
      limit,
      offset,
      order: [
        literal(
          `STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(event_host, '$.start_date')), '%Y-%m-%d') ASC`
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
}

export default EventService;
