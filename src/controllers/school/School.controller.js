import CollegeService from "../../services/college/College.service.js";

const collegeService = new CollegeService();

class SchoolController {
    static async listSchools(req, res) {
        try {
            const { items, pagination } = await collegeService.listSchools(req.query);

            return res.status(200).json({
                message: "success",
                items,
                pagination,
            });
        } catch (error) {
            console.error("Error in listSchools:", error);
            return res.status(500).json({
                message: `Error: ${error.message}`,
            });
        }
    }

    static async getSchoolBySlug(req, res) {
        try {
            const school = await collegeService.getSchoolBySlug(req.params.slugs);

            return res.status(200).json({
                message: "success",
                item: school,
            });
        } catch (error) {
            console.error("Error in getSchoolBySlug:", error);
            const status = error.status || 500;
            return res.status(status).json({
                message: status === 500 ? "Server error" : error.message,
            });
        }
    }
}

export default SchoolController;
