import Banner from "../model/BannerModel.js";

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
