import Banner from "../model/BannerModel.js";
import BannerGallery from "../model/BannerGallery.js";

export const deleteBanner = async (req, res) => {
  try {
    const deletedRows = await Banner.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Banner not found" });
    }
    return res.status(204).json({ message: "Banner deleted" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteBannerGalleryItem = async (req, res) => {
  try {
    const { galleryId } = req.params;

    // Find the BannerGallery item to delete
    const bannerGalleryItem = await BannerGallery.findByPk(galleryId);

    if (!bannerGalleryItem) {
      return res.status(404).json({ message: "Banner gallery item not found" });
    }

    // Delete the item
    await bannerGalleryItem.destroy();

    return res
      .status(200)
      .json({ message: "Banner gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
