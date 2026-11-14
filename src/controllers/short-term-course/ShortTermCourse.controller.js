import ShortTermCourseService from "../../services/short-term-course/ShortTermCourse.service.js";

const shortTermCourseService = new ShortTermCourseService();

const resolveViewer = (req) => {
    const userId = req.user?.id || null;
    let role = req.user?.role ?? req.user?.roles ?? {};
    if (typeof role === "string") {
        try {
            role = JSON.parse(role);
        } catch {
            role = {};
        }
    }
    const isStaff = Boolean(role?.admin || role?.editor);
    return { userId, isStaff };
};

class ShortTermCourseController {
    static async listCourses(req, res) {
        try {
            const access = resolveViewer(req);
            const { items, pagination } = await shortTermCourseService.listCourses(
                { ...req.query, ...access }
            );
            return res.status(200).json({
                message: "Short Term Courses retrieved",
                items,
                pagination,
            });
        } catch (error) {
            console.error("Error getting Short Term Courses:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }

    static async getCourseById(req, res) {
        try {
            const access = resolveViewer(req);
            const course = await shortTermCourseService.getCourseById(
                req.params.id,
                access
            );
            return res.status(200).json(course);
        } catch (error) {
            console.error("Error getting Short Term Course by ID:", error);
            return res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async getCourseBySlug(req, res) {
        try {
            const access = resolveViewer(req);
            const course = await shortTermCourseService.getCourseBySlug(
                req.params.slug,
                access
            );
            return res.status(200).json(course);
        } catch (error) {
            console.error("Error getting Short Term Course by Slug:", error);
            return res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async createCourse(req, res) {
        try {
            const result = await shortTermCourseService.createCourse(
                req.body
            );
            return res.status(201).json({ message: "Short Term Course created successfully", course: result });
        } catch (error) {
            console.error("Error in createCourse:", error);
            return res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async updateCourse(req, res) {
        try {
            const result = await shortTermCourseService.updateCourse(
                req.params.id,
                req.body
            );
            return res.status(200).json({ message: "Short Term Course updated successfully", course: result });
        } catch (error) {
            console.error("Error in updateCourse:", error);
            return res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async deleteCourse(req, res) {
        try {
            await shortTermCourseService.deleteCourse(req.params.id);
            return res.status(200).json({ message: "Short Term Course deleted" });
        } catch (error) {
            console.error("Error deleting Short Term Course:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }
}

export default ShortTermCourseController;
