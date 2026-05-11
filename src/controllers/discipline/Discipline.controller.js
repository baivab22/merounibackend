import DisciplineService from "../../services/discipline/Discipline.service.js";

const disciplineService = new DisciplineService();

class DisciplineController {
    static async listDisciplines(req, res) {
        try {
            const { items, pagination } = await disciplineService.listDisciplines(
                req.query
            );
            return res.status(200).json({
                message: "Disciplines retrieved",
                items,
                pagination,
            });
        } catch (error) {
            console.error("Error getting Disciplines:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }

    static async getDisciplineById(req, res) {
        try {
            const discipline = await disciplineService.getDisciplineById(req.params.id);
            return res.status(200).json(discipline);
        } catch (error) {
            console.error("Error getting Discipline by ID:", error);
            return res.status(500).json({ error: "Failed to get discipline" });
        }
    }

    static async getDisciplineBySlug(req, res) {
        try {
            const discipline = await disciplineService.getDisciplineBySlug(
                req.params.slug
            );
            return res.status(200).json(discipline);
        } catch (error) {
            console.error("Error getting Discipline by Slug:", error);
            return res.status(500).json({ error: "Failed to get discipline" });
        }
    }

    static async createDiscipline(req, res) {
        try {
            const result = await disciplineService.createDiscipline(req.body);
            return res
                .status(201)
                .json({ message: "Discipline created successfully", discipline: result });
        } catch (error) {
            console.error("Error in createDiscipline:", error);
            return res.status(500).json({ error: "Failed to create discipline" });
        }
    }

    static async updateDiscipline(req, res) {
        try {
            const result = await disciplineService.updateDiscipline(req.params.id, req.body);
            return res
                .status(200)
                .json({ message: "Discipline updated successfully", discipline: result });
        } catch (error) {
            console.error("Error in updateDiscipline:", error);
            return res.status(500).json({ error: "Failed to update discipline" });
        }
    }

    static async deleteDiscipline(req, res) {
        try {
            await disciplineService.deleteDiscipline(req.params.id);
            return res.status(200).json({ message: "Discipline deleted" });
        } catch (error) {
            console.error("Error deleting Discipline:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }

    static async updateDisciplineOrder(req, res) {
        try {
            const result = await disciplineService.updateDisciplineOrder(req.body.disciplines);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message || "Failed to update discipline order" });
        }
    }
}

export default DisciplineController;
