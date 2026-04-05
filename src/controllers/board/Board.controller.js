import BoardService from "../../services/board/Board.service.js";

const boardService = new BoardService();

class BoardController {
  static async listBoards(req, res) {
    try {
      const { items, pagination } = await boardService.listBoards(req.query);
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error in BoardController:", error);
      const status = error.status || (error.name === 'SequelizeUniqueConstraintError' ? 409 : 500);
      return res.status(status).json({
        message: status === 500 ? "Internal server error" : (error.errors?.[0]?.message || error.message),
        error: error.message,
      });
    }
  }

  static async getBoard(req, res) {
    try {
      const item = await boardService.getBoard(req.params.id);
      return res.status(200).json({ message: "Board retrieved", item });
    } catch (error) {
      console.error("Error getting board:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async createBoard(req, res) {
    try {
      const item = await boardService.createBoard(req.body);
      return res.status(201).json({ message: "Board created", item });
    } catch (error) {
      console.error("Error creating board:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateBoard(req, res) {
    try {
      await boardService.updateBoard(req.query.id || req.params.id, req.body);
      return res.status(200).json({ message: "Board updated" });
    } catch (error) {
      console.error("Error updating board:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async deleteBoard(req, res) {
    try {
      await boardService.deleteBoard(req.query.id || req.params.id);
      return res.status(200).json({ message: "Board deleted" });
    } catch (error) {
      console.error("Error deleting board:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default BoardController;
