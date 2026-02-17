import Wishlist from "../../models/wishlist/Wishlist.model.js";
import UserModel from "../../models/users/User.model.js";
import College from "../../models/college/College.model.js";

import Consultancy from "../../models/consultancy/Consultancy.model.js";

class WishlistService {
  async getUserWishlist(user_id) {
    if (!user_id) {
      const error = new Error("User ID is required");
      error.status = 400;
      throw error;
    }

    return Wishlist.findAll({
      where: {
        user_id,
      },
      include: [
        {
          model: College,
          as: "college",
          attributes: ["id", "name", "slugs", "description", "college_logo"],
        },
        {
          model: Consultancy,
          as: "consultancy",
          attributes: ["id", "title", "slugs", "description", "logo", "address", "featured_image", "pinned"],
        },
      ],
    });
  }

  async addToWishlist(user_id, college_id, consultancy_id) {
    const user = await UserModel.findByPk(user_id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    let existingWishlist;

    if (college_id) {
      const college = await College.findByPk(college_id);
      if (!college) {
        const error = new Error("College not found");
        error.status = 404;
        throw error;
      }
      existingWishlist = await Wishlist.findOne({
        where: { user_id, college_id },
      });
    } else if (consultancy_id) {
       const consultancy = await Consultancy.findByPk(consultancy_id);
      if (!consultancy) {
        const error = new Error("Consultancy not found");
        error.status = 404;
        throw error;
      }
      existingWishlist = await Wishlist.findOne({
        where: { user_id, consultancy_id },
      });
    } else {
        const error = new Error("College ID or Consultancy ID required");
        error.status = 400;
        throw error;
    }

    if (existingWishlist) {
      const error = new Error("Item already in wishlist");
      error.status = 400;
      throw error;
    }

    return Wishlist.create({ user_id, college_id, consultancy_id });
  }

  async removeFromWishlist(user_id, college_id, consultancy_id) {
    const whereClause = { user_id };
    if (college_id) whereClause.college_id = college_id;
    if (consultancy_id) whereClause.consultancy_id = consultancy_id;

    const deleted = await Wishlist.destroy({
      where: whereClause,
    });

    if (!deleted) {
      const error = new Error("Wishlist item not found");
      error.status = 404;
      throw error;
    }
  }
}

export default WishlistService;
