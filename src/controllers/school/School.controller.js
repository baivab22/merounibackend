import schoolService from "../../services/college/school.service.js";

class SchoolController {
    static async listSchools(req, res) {
        try {
            const { items, pagination } = await schoolService.listSchools(req.query);

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
            const school = await schoolService.getSchoolBySlug(req.params.slugs);

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
    static async updateSchoolOrder(req, res) {
        try {
            const result = await schoolService.updateSchoolOrder(req.body.schools);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in updateSchoolOrder:", error);
            const status = error.status || 500;
            return res.status(status).json({
                message: status === 500 ? "Server error" : error.message,
            });
        }
    }

    static async listSchoolUniversities(req, res) {
        try {
            const universities = await schoolService.listSchoolUniversities();
            console.log(universities, "universitiesuniversities")
            return res.status(200).json({
                message: "success",
                items: universities,
            });
        } catch (error) {
            console.error("Error in listSchoolUniversities:", error);
            return res.status(500).json({
                message: `Error: ${error.message}`,
            });
        }
    }
}

export default SchoolController;
