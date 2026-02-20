import { Op } from "sequelize";

import Banner from "../../models/banner/Banner.model.js";
import College from "../../models/college/College.model.js";

class BannerService {
  async createBanners(payload) {
    const {
      college_id,
      title,
      banner_image,
      website_url,
      display_position,
      priority,
      date_of_expiry,
      is_featured,
    } = payload;

    if (college_id) {
      const college = await College.findByPk(college_id);
      if (!college) {
        const error = new Error("College not found");
        error.status = 404;
        throw error;
      }
    }

    const newBanner = await Banner.create({
      title,
      college_id,
      banner_image,
      website_url,
      display_position,
      priority,
      date_of_expiry,
      is_featured,
    });

    return newBanner;
  }

  async listBanners(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();
    const search = query.q || "";
    const filter = query.filter || "active";

    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (filter === "active") {
      whereCondition.date_of_expiry = { [Op.gte]: new Date() };
    }

    const { count: totalCount, rows: items } = await Banner.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
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

  async getBannersByCollege(collegeId) {
    const college = await College.findByPk(collegeId, {
      include: {
        model: Banner,
      },
    });

    if (!college) {
      const error = new Error("College not found");
      error.status = 404;
      throw error;
    }

    return college;
  }

  async deleteBanner(id) {
    const deletedRows = await Banner.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Banner not found");
      error.status = 404;
      throw error;
    }
  }

  async updateBanner(id, payload) {
    const {
      college_id,
      title,
      banner_image,
      website_url,
      display_position,
      priority,
      date_of_expiry,
      is_featured,
    } = payload;

    const banner = await Banner.findByPk(id);
    if (!banner) {
      const error = new Error("Banner not found");
      error.status = 404;
      throw error;
    }

    // if (college_id) {
    //   const college = await College.findByPk(college_id);
    //   if (!college) {
    //     const error = new Error("College not found");
    //     error.status = 404;
    //     throw error;
    //   }
    // }

    await banner.update({
      title: title !== undefined ? title : banner.title,
      college_id: college_id !== undefined ? college_id : banner.college_id,
      banner_image:
        banner_image !== undefined ? banner_image : banner.banner_image,
      website_url: website_url !== undefined ? website_url : banner.website_url,
      display_position:
        display_position !== undefined
          ? display_position
          : banner.display_position,
      priority: priority !== undefined ? priority : banner.priority,
      date_of_expiry:
        date_of_expiry !== undefined ? date_of_expiry : banner.date_of_expiry,
      is_featured:
        is_featured !== undefined ? is_featured : banner.is_featured,
    });

    return banner;
  }
}

export default BannerService;
