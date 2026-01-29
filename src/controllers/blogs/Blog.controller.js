import BlogService from "../../services/blogs/Blog.service.js";

const blogService = new BlogService();

class BlogController {
    static async listBlogs(req, res) {
        try {
            const { items, pagination } = await blogService.listBlogs(req.query);
            return res.status(200).json({
                message: "Blogs retrieved",
                items,
                pagination,
            });
        } catch (error) {
            console.error("Error getting blogs:", error);
            const status = error.status || 500;
            return res.status(status).json({
                message: status === 500 ? "Server error" : error.message,
                error: error.message,
            });
        }
    }

    static async getBlog(req, res) {
        try {
            const { blog, similarBlogs } = await blogService.getBlog(req.params.slug);

            return res.status(200).json({
                message: "Blog retrieved",
                blog,
                similarBlogs,
            });
        } catch (error) {
            console.error("Error getting blog by ID:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }

    static async getBlogBySlug(req, res) {
        try {
            const { blog, similarBlogs } = await blogService.getBlog(req.params.slug);

            return res.status(200).json({
                message: "Blog retrieved",
                blog,
                similarBlogs,
            });
        } catch (error) {
            console.error("Error getting blog by slug:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }

    static async createBlog(req, res) {
        try {
            const newBlog = await blogService.createBlog(req.body);

            return res.status(201).json({ message: "Blog created", blog: newBlog });
        } catch (error) {
            console.error("Error creating blog:", error);
            const status = error.status || 500;
            return res.status(status).json({
                message: status === 500 ? "Server error" : error.message,
                error: error.message,
            });
        }
    }

    static async updateBlog(req, res) {
        try {
            const updatedBlog = await blogService.updateBlog(req.query.id, req.body);
            return res
                .status(200)
                .json({ message: "Blog updated", blog: updatedBlog });
        } catch (error) {
            console.error("Error updating blog:", error);
            const status = error.status || 500;
            return res.status(status).json({
                message: status === 500 ? "Server error" : error.message,
                error: error.message,
            });
        }
    }

    static async deleteBlog(req, res) {
        try {
            await blogService.deleteBlog(req.query.id);
            return res.status(200).json({ message: "Blog deleted" });
        } catch (error) {
            console.error("Error deleting blog:", error);
            const status = error.status || 500;
            return res.status(status).json({
                message: status === 500 ? "Server error" : error.message,
                error: error.message,
            });
        }
    }
}

export default BlogController;
