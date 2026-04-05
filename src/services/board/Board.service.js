import { Op } from "sequelize";
import Board from "../../models/board/Board.model.js";
import Stream from "../../models/stream/Stream.model.js";
import Program from "../../models/program/Program.model.js";


class BoardService {
  async listBoards(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const search = query.q || "";

    const whereCondition = search
      ? {
          name: {
            [Op.like]: `%${search}%`,
          },
        }
      : {};

    const include = [];
    if (query.includeStreams === "true") {
      include.push({
        model: Stream,
        as: "streams",
        include: [
          {
            model: Program,
            as: "programs",
            attributes: ["id"],
            through: { attributes: [] }
          },
        ],
      });
    }


    const { count: totalCount, rows: items } = await Board.findAndCountAll({
      where: whereCondition,
      include,
      distinct: true,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getBoard(id) {
    const board = await Board.findByPk(id);
    if (!board) {
      const error = new Error("Board not found");
      error.status = 404;
      throw error;
    }
    return board;
  }

  async createBoard({ name }) {
    return Board.create({ name });
  }

  async updateBoard(id, data) {
    const board = await Board.findByPk(id);

    if (!board) {
      const error = new Error("Board not found");
      error.status = 404;
      throw error;
    }

    const [updatedCount] = await Board.update(
      { ...data },
      {
        where: { id },
      }
    );

    if (updatedCount === 0) {
      const error = new Error("Board already up to date");
      error.status = 404;
      throw error;
    }
  }

  async deleteBoard(id) {
    const deletedRows = await Board.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Board not found");
      error.status = 404;
      throw error;
    }
  }
}

export default BoardService;
