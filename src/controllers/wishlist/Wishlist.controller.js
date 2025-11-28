import WishlistService from "../../services/wishlist/Wishlist.service.js";

const wishlistService = new WishlistService();

class WishlistController {
  static async getUserWishlist(req, res) {
    try {
      const items = await wishlistService.getUserWishlist(req.query.user_id);
      return res.status(200).json({
        message: "success",
        items,
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ message: error.message });
    }
  }

  static async addToWishlist(req, res) {
    try {
      const wishlistItem = await wishlistService.addToWishlist(
        req.body.user_id,
        req.body.college_id
      );

      return res.status(201).json({
        message: "College added to wishlist",
        items: wishlistItem,
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ message: error.message });
    }
  }

  static async removeFromWishlist(req, res) {
    try {
      await wishlistService.removeFromWishlist(
        req.body.user_id,
        req.body.college_id
      );
      return res.status(200).json({ message: "College removed from wishlist" });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ message: error.message });
    }
  }
}

export default WishlistController;
