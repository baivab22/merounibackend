import ExamService from "../../services/exam/Exam.service.js";

const examService = new ExamService();

class ExamController {
  static async listExams(req, res) {
    try {
      const { items, pagination } = await examService.listExams(req.query);

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? error.message : error.message,
      });
    }
  }

  static async listAdminExams(req, res) {
    try {
      const { items, pagination } = await examService.listAdminExams(req.query);

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? error.message : error.message,
      });
    }
  }

  static async getExam(req, res) {
    try {
      const item = await examService.getExam(req.params.slugs);
      return res.status(200).json({ message: "Exam retrieved", item });
    } catch (error) {
      console.error("Error getting exam:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async createOrUpdateExam(req, res) {
    try {
      const result = await examService.createOrUpdateExam(req.body);
      return res.status(200).json({
        message: req.body.id
          ? "Exam updated successfully!"
          : "Exam created successfully!",
        examId: result.id,
      });
    } catch (error) {
      console.log(error, "Thanks");

      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? error.message : error.message,
      });
    }
  }

  static async deleteExam(req, res) {
    try {
      await examService.deleteExam(req.params.id);
      return res.status(200).json({ message: "Exam deleted" });
    } catch (error) {
      console.error("Error deleting exam:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default ExamController;
