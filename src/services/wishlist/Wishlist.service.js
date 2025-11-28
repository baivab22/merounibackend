import Wishlist from "../../models/wishlist/Wishlist.model.js";
import UserModel from "../../models/users/User.model.js";
import College from "../../models/college/College.model.js";

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
          attributes: ["id", "name", "slugs", "description"],
        },
      ],
    });
  }

  async addToWishlist(user_id, college_id) {
    const user = await UserModel.findByPk(user_id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const college = await College.findByPk(college_id);
    if (!college) {
      const error = new Error("College not found");
      error.status = 404;
      throw error;
    }

    const existingWishlist = await Wishlist.findOne({
      where: { user_id, college_id },
    });

    if (existingWishlist) {
      const error = new Error("College already in wishlist");
      error.status = 400;
      throw error;
    }

    return Wishlist.create({ user_id, college_id });
  }

  async removeFromWishlist(user_id, college_id) {
    const deleted = await Wishlist.destroy({
      where: { user_id, college_id },
    });

    if (!deleted) {
      const error = new Error("Wishlist item not found");
      error.status = 404;
      throw error;
    }
  }
}

export default WishlistService;
