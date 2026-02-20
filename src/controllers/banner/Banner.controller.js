import BannerService from "../../services/banner/Banner.service.js";

const bannerService = new BannerService();

class BannerController {
  static async createBanner(req, res) {
    try {
      await bannerService.createBanners(req.body);

      return res.status(201).json({ message: "Banner added successfully" });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async getBanners(req, res) {
    try {
      const result = await bannerService.listBanners(req.query);

      return res.status(200).json({
        message: "success",
        ...result,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async getBannersById(req, res) {
    try {
      const college = await bannerService.getBannersByCollege(req.params.id);

      return res.json({
        message: "success",
        items: college,
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async updateBanner(req, res) {
    try {
      await bannerService.updateBanner(req.params.id, req.body);

      return res.status(200).json({ message: "Banner updated successfully" });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async deleteBanner(req, res) {
    try {
      await bannerService.deleteBanner(req.params.id);
      return res.status(204).json({ message: "Banner deleted" });
    } catch (error) {
      console.error("Error deleting banner:", error);
      res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default BannerController;
