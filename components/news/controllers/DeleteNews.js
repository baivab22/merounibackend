import Blog from "../model/NewsModel.js";

export const deleteBlog = async (req, res) => {
  try {
    const deletedRows = await Blog.destroy({ where: { id: req.query.id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
