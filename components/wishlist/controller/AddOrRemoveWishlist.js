import Wishlist from "../model/WishlistModel.js";
import User from "../../users/model/UserModel.js";
import College from "../../college/models/CollegeModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const { user_id, college_id } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if college exists
    const college = await College.findByPk(college_id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      where: { user_id, college_id },
    });

    if (existingWishlist) {
      return res.status(400).json({ message: "College already in wishlist" });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({ user_id, college_id });

    return res
      .status(201)
      .json({ message: "College added to wishlist", items: wishlistItem });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { user_id, college_id } = req.body;

    const deleted = await Wishlist.destroy({ where: { user_id, college_id } });

    if (!deleted) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    return res.status(200).json({ message: "College removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
