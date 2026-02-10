import SkillsBasedCourseService from "../../services/skills-based-course/SkillsBasedCourse.service.js";

const skillsBasedCourseService = new SkillsBasedCourseService();

class SkillsBasedCourseController {
    static async listCourses(req, res) {
        try {
            const { items, pagination } = await skillsBasedCourseService.listCourses(
                req.query
            );
            return res.status(200).json({
                message: "Skills Based Courses retrieved",
                items,
                pagination,
            });
        } catch (error) {
            console.error("Error getting Skills Based Courses:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }

    static async getCourseById(req, res) {
        try {
            const course = await skillsBasedCourseService.getCourseById(
                req.params.id
            );
            return res.status(200).json(course);
        } catch (error) {
            console.error("Error getting Skills Based Course by ID:", error);
            return res.status(500).json({ error: "Failed to get course" });
        }
    }

    static async getCourseBySlug(req, res) {
        try {
            const course = await skillsBasedCourseService.getCourseBySlug(
                req.params.slug
            );
            return res.status(200).json(course);
        } catch (error) {
            console.error("Error getting Skills Based Course by Slug:", error);
            return res.status(500).json({ error: "Failed to get course" });
        }
    }

    static async createCourse(req, res) {
        try {
            const result = await skillsBasedCourseService.createCourse(
                req.body
            );
            return res.status(201).json({ message: "Skills Based Course created successfully", course: result });
        } catch (error) {
            console.error("Error in createCourse:", error);
            return res.status(500).json({ error: "Failed to create course" });
        }
    }

    static async updateCourse(req, res) {
        try {
            const result = await skillsBasedCourseService.updateCourse(
                req.params.id,
                req.body
            );
            return res.status(200).json({ message: "Skills Based Course updated successfully", course: result });
        } catch (error) {
            console.error("Error in updateCourse:", error);
            return res.status(500).json({ error: "Failed to update course" });
        }
    }

    static async deleteCourse(req, res) {
        try {
            await skillsBasedCourseService.deleteCourse(req.params.id);
            return res.status(200).json({ message: "Skills Based Course deleted" });
        } catch (error) {
            console.error("Error deleting Skills Based Course:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }
}

export default SkillsBasedCourseController;
