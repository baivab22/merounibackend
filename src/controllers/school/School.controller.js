import schoolService from "../../services/college/school.service.js";

class SchoolController {
    static async listSchools(req, res) {
        try {
            let isAdmin = false;
            const roles = req.user?.roles || req.user?.role;
            if (roles) {
                try {
                    const userRoles = typeof roles === "string" ? JSON.parse(roles) : roles;
                    if (userRoles["admin"] || userRoles["editor"]) {
                        isAdmin = true;
                    }
                } catch (e) {
                    // ignore parsing error
                }
            }

            const { items, pagination } = await schoolService.listSchools(req.query, isAdmin);

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

    static async listSchoolAffiliations(req, res) {
        try {
            const universities = await schoolService.listSchoolAffiliations();
            return res.status(200).json({
                message: "success",
                items: universities,
            });
        } catch (error) {
            console.error("Error in listSchoolAffiliations:", error);
            return res.status(500).json({
                message: `Error: ${error.message}`,
            });
        }
    }

    static async listSchoolBoards(req, res) {
        try {
            const boards = await schoolService.listSchoolBoards();
            return res.status(200).json({
                message: "success",
                items: boards,
            });
        } catch (error) {
            console.error("Error in listSchoolBoards:", error);
            return res.status(500).json({
                message: `Error: ${error.message}`,
            });
        }
    }

    static async listSchoolStreams(req, res) {
        try {
            const streams = await schoolService.listSchoolStreams();
            return res.status(200).json({
                message: "success",
                items: streams,
            });
        } catch (error) {
            console.error("Error in listSchoolStreams:", error);
            return res.status(500).json({
                message: `Error: ${error.message}`,
            });
        }
    }
}


export default SchoolController;
