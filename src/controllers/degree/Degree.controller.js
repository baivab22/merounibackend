
import DegreeService from "../../services/degree/Degree.service.js";

class DegreeController {
    static async listDegrees(req, res, next) {
        try {
            const result = await DegreeService.listDegrees(req.query);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error,"DONEDONE")
            next(error);
        }
    }

    static async getDegreeById(req, res, next) {
        try {
            const degree = await DegreeService.getDegreeById(req.params.id);
            return res.status(200).json(degree);
        } catch (error) {
            next(error);
        }
    }

    static async getDegreeBySlug(req, res, next) {
        try {
            const degree = await DegreeService.getDegreeBySlug(req.params.slug);
            return res.status(200).json(degree);
        } catch (error) {
            next(error);
        }
    }

    static async createDegree(req, res, next) {
        try {
            const degree = await DegreeService.createDegree(req.body);
            return res.status(201).json(degree);
        } catch (error) {
            next(error);
        }
    }

    static async updateDegree(req, res, next) {
        try {
            const degree = await DegreeService.updateDegree(req.params.id, req.body);
            return res.status(200).json(degree);
        } catch (error) {
            next(error);
        }
    }

    static async deleteDegree(req, res, next) {
        try {
            await DegreeService.deleteDegree(req.params.id);
            return res.status(200).json({ message: "Degree deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
    static async updateDegreeOrder(req, res, next) {
        try {
            console.log(req.body.degrees,"req.body.degreesreq.body.degreesreq.body.degrees")
            const result = await DegreeService.updateDegreeOrder(req.body.degrees);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default DegreeController;
