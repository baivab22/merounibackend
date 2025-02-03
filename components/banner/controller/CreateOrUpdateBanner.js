import Banner from "../model/BannerModel.js";
import BannerGallery from "../model/BannerGallery.js";
import College from "../../college/models/CollegeModel.js";

export const createBanner = async (req, res) => {
  try {
    const { collegeId, bannerImage } = req.body;

    // Check if the college exists
    const college = await College.findByPk(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    for (const banner of bannerImage) {
      const newBanner = await Banner.create({
        title: banner.title,
        college_id: collegeId,
      });

      for (const [size, url] of Object.entries(banner.gallery)) {
        await BannerGallery.create({
          banner_id: newBanner.id,
          size,
          url,
        });
      }
    }

    res.status(201).json({ message: "Banners added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
