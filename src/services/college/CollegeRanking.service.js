import { Op } from "sequelize";
import CollegeRanking from "../../models/college/CollegeRanking.model.js";
import College from "../../models/college/College.model.js";
import Program from "../../models/program/Program.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import { sequelize } from "../../config/database.config.js";

class CollegeRankingService {
  async listRankings(query = {}) {
    const programId = query.program_id ? parseInt(query.program_id, 10) : null;

    const whereCondition = {};
    if (programId) {
      whereCondition.program_id = programId;
    }

    // First, get all ranking IDs to avoid duplicates from joins
    const rankingIds = await CollegeRanking.findAll({
      where: whereCondition,
      attributes: ["id"],
      order: [
        ["program_id", "ASC"],
        ["rank", "ASC"],
      ],
      raw: true,
    });

    const uniqueRankingIds = [...new Set(rankingIds.map((r) => r.id))];

    // If no rankings found, return empty array
    if (uniqueRankingIds.length === 0) {
      return [];
    }

    // Now fetch the full data for unique ranking IDs only
    const rankings = await CollegeRanking.findAll({
      where: {
        ...whereCondition,
        id: { [Op.in]: uniqueRankingIds },
      },
      include: [
        {
          model: College,
          as: "college",
          attributes: ["id", "name", "slugs", "college_logo", "featured_img"],
          include: [
            {
              model: CollegeAddress,
              as: "collegeAddress",
              required: false,
            },
          ],
        },
        {
          model: Program,
          as: "program",
          attributes: ["id", "title", "slugs"],
        },
      ],
      order: [
        ["program_id", "ASC"],
        ["rank", "ASC"],
      ],
    });

    // Group by program_id and get program_list_order from rankings
    const grouped = rankings.reduce((acc, ranking) => {
      const programId = ranking.program_id;
      if (!acc[programId]) {
        acc[programId] = {
          program: ranking.program,
          programListOrder: ranking.program_list_order || 9999, // Default high order for programs without order
          rankings: [],
        };
      }
      // Double-check to prevent duplicates in the array
      const exists = acc[programId].rankings.some((r) => r.id === ranking.id);
      if (!exists) {
        acc[programId].rankings.push(ranking);
      }
      return acc;
    }, {});

    // Sort by program_list_order, then by program_id
    const sortedGroups = Object.values(grouped).sort((a, b) => {
      if (a.programListOrder !== b.programListOrder) {
        return a.programListOrder - b.programListOrder;
      }
      return a.program.id - b.program.id;
    });

    return sortedGroups;
  }

  async getRankingsByProgram(programId) {
    const rankings = await CollegeRanking.findAll({
      where: { program_id: programId },
      include: [
        {
          model: College,
          as: "college",
          attributes: ["id", "name", "slugs", "college_logo", "featured_img"],
          include: [
            {
              model: CollegeAddress,
              as: "collegeAddress",
            },
          ],
        },
        {
          model: Program,
          as: "program",
          attributes: ["id", "title", "slugs"],
        },
      ],
      order: [["rank", "ASC"]],
    });

    return rankings;
  }

  async createRanking(data) {
    const { program_id, college_id, rank } = data;

    // Use transaction to prevent race conditions when multiple colleges are added quickly
    const transaction = await sequelize.transaction();

    try {
      // Check if ranking already exists for this program and college
      const existing = await CollegeRanking.findOne({
        where: {
          program_id,
          college_id,
        },
        transaction,
      });

      if (existing) {
        const error = new Error("College is already ranked for this program");
        error.status = 400;
        throw error;
      }

      // Ensure program has a program_list_order (set if doesn't exist)
      const existingRankings = await CollegeRanking.findAll({
        where: { program_id },
        attributes: ["program_list_order"],
        limit: 1,
        transaction,
      });

      let programListOrder = null;
      if (
        existingRankings.length === 0 ||
        existingRankings[0].program_list_order === null
      ) {
        // Get current max program_list_order
        const maxProgramOrder =
          (await CollegeRanking.max("program_list_order", { transaction })) ||
          0;
        programListOrder = maxProgramOrder + 1;
      } else {
        programListOrder = existingRankings[0].program_list_order;
      }

      // Get current max rank for this program within transaction to prevent race conditions
      const maxRank =
        (await CollegeRanking.max("rank", {
          where: { program_id },
          transaction,
        })) || 0;
      const newRank = rank || maxRank + 1;

      const ranking = await CollegeRanking.create(
        {
          program_id,
          college_id,
          rank: newRank,
          program_list_order: programListOrder,
        },
        { transaction }
      );

      // If this is the first ranking for the program, update all existing rankings for this program
      if (
        existingRankings.length > 0 &&
        existingRankings[0].program_list_order === null
      ) {
        await CollegeRanking.update(
          { program_list_order: programListOrder },
          { where: { program_id }, transaction }
        );
      }

      await transaction.commit();
      return ranking;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateRankingOrder(programId, rankings) {
    // Validate all rankings belong to the program
    const existingRankings = await CollegeRanking.findAll({
      where: {
        program_id: programId,
        id: { [Op.in]: rankings.map((r) => r.id) },
      },
    });

    if (existingRankings.length !== rankings.length) {
      const error = new Error("Invalid ranking IDs");
      error.status = 400;
      throw error;
    }

    // Update ranks in transaction
    const updates = rankings.map((ranking) =>
      CollegeRanking.update(
        { rank: ranking.rank },
        { where: { id: ranking.id } }
      )
    );

    await Promise.all(updates);

    return await this.getRankingsByProgram(programId);
  }

  async deleteRanking(rankingId) {
    const ranking = await CollegeRanking.findByPk(rankingId);
    if (!ranking) {
      const error = new Error("Ranking not found");
      error.status = 404;
      throw error;
    }

    await ranking.destroy();
  }

  async deleteRankingsByProgram(programId) {
    await CollegeRanking.destroy({
      where: { program_id: programId },
    });
  }

  async updateProgramOrder(programOrders) {
    const transaction = await sequelize.transaction();
    try {
      // Update program_list_order for all rankings of each program
      const updates = programOrders.map((po) =>
        CollegeRanking.update(
          { program_list_order: po.program_list_order },
          { where: { program_id: po.program_id }, transaction }
        )
      );

      await Promise.all(updates);
      await transaction.commit();

      return { message: "Program order updated successfully" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default CollegeRankingService;
