import Wishlist from "../model/WishlistModel.js";
import College from "../../college/models/CollegeModel.js";

export const getUserWishlist = async (req, res) => {
  try {
    const { user_id } = req.query;

    const items = await Wishlist.findAll({
      where: { user_id },
      include: [{ model: College, attributes: ["id", "name"] }],
    });

    return res.status(200).json({
      message: "success",
      items,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
