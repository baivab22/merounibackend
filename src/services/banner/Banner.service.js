import { Op } from "sequelize";

import Banner from "../../models/banner/Banner.model.js";
import BannerGallery from "../../models/banner/BannerGallery.model.js";
import College from "../../models/college/College.model.js";

class BannerService {
  async createBanners(payload) {
    const {
      collegeId,
      bannerImage,
      website_url,
      display_position,
      priority,
      date_of_expiry,
    } = payload;

    const college = await College.findByPk(collegeId);
    if (!college) {
      const error = new Error("College not found");

      error.status = 404;
      throw error;
    }

    for (const banner of bannerImage) {
      const newBanner = await Banner.create({
        title: banner.title,
        college_id: collegeId,
        website_url,
        display_position,
        priority,
        date_of_expiry,
      });

      for (const [size, url] of Object.entries(banner.gallery)) {
        await BannerGallery.create({
          banner_id: newBanner.id,
          size,
          url,
          is_featured: banner.is_featured,
        });
      }
    }
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
      include: {
        model: BannerGallery,
      },
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
        include: [BannerGallery],
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

  async deleteGalleryItem(galleryId) {
    const bannerGalleryItem = await BannerGallery.findByPk(galleryId);

    if (!bannerGalleryItem) {
      const error = new Error("Banner gallery item not found");
      error.status = 404;
      throw error;
    }

    await bannerGalleryItem.destroy();
  }
}

export default BannerService;
