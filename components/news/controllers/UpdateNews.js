import Blog from "../model/NewsModel.js";

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.query;
    const {
      title,
      category,
      tags,
      description,
      content,
      featuredImage,
      author,
      reactions,
      status,
      visibility,
    } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let updatedSlug = blog.slug;
    if (title && title !== blog.title) {
      updatedSlug = slug(title);
    }

    const [updatedRows] = await Blog.update(
      {
        title,
        slug: updatedSlug,
        category,
        tags,
        description,
        content,
        featuredImage,
        author,
        reactions,
        status,
        visibility,
      },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Blog not found" }); 
    }

    const updatedBlog = await Blog.findByPk(id);
    res.status(200).json({ message: "Blog updated", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
