import { Op } from "sequelize";
import Stream from "../../models/stream/Stream.model.js";
import Board from "../../models/board/Board.model.js";
import Program from "../../models/program/Program.model.js";
import StreamProgram from "../../models/stream/StreamProgram.model.js";


class StreamService {
  async listStreams(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const search = query.q || "";
    const boardIdsRaw = query.board_ids || query.board_id;
    const whereCondition = {};

    if (search) {
      whereCondition.name = { [Op.like]: `%${search}%` };
    }

    if (boardIdsRaw) {
      const boardIds = Array.isArray(boardIdsRaw) 
        ? boardIdsRaw.map(Number) 
        : String(boardIdsRaw).split(',').map(Number).filter(id => !isNaN(id));
      
      if (boardIds.length > 0) {
        whereCondition.board_id = { [Op.in]: boardIds };
      }
    }



    const { count: totalCount, rows: items } = await Stream.findAndCountAll({
      where: whereCondition,
      include: [{ model: Board, as: "board" }],
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

  async getStream(id) {
    const stream = await Stream.findByPk(id, {
      include: [
        { model: Board, as: "board" },
        { 
          model: Program, 
          as: "programs",
          attributes: ["id", "title"] 
        }
      ],
    });

    if (!stream) {
      const error = new Error("Stream not found");
      error.status = 404;
      throw error;
    }
    return stream;
  }

  async createStream({ name, board_id }) {
    return Stream.create({ name, board_id });
  }

  async updateStream(id, data) {
    const stream = await Stream.findByPk(id);

    if (!stream) {
      const error = new Error("Stream not found");
      error.status = 404;
      throw error;
    }

    const [updatedCount] = await Stream.update(
      { ...data },
      {
        where: { id },
      }
    );

    if (updatedCount === 0) {
      const error = new Error("Stream already up to date");
      error.status = 404;
      throw error;
    }
  }

  async deleteStream(id) {
    const deletedRows = await Stream.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Stream not found");
      error.status = 404;
      throw error;
    }
  }

  async linkPrograms(streamId, programIds) {
    const stream = await Stream.findByPk(streamId);
    if (!stream) {
      const error = new Error("Stream not found");
      error.status = 404;
      throw error;
    }

    // Use setPrograms (Sequelize mixin for belongsToMany)
    // This will replace all existing associations with the new ones
    await stream.setPrograms(programIds);
    return stream;
  }

  async unlinkProgram(streamId, programId) {
    const stream = await Stream.findByPk(streamId);
    if (!stream) {
      const error = new Error("Stream not found");
      error.status = 404;
      throw error;
    }

    await stream.removeProgram(programId);
    return stream;
  }
}


export default StreamService;
