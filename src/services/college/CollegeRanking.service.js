import { Op } from "sequelize";
import { getUniqueSlug } from "../../utils/SlugHelper.js";
import CollegeRanking from "../../models/college/CollegeRanking.model.js";
import CollegeRankingParent from "../../models/college/CollegeRankingParent.model.js";
import College from "../../models/college/College.model.js";
import Degree from "../../models/degree/Degree.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import { sequelize } from "../../config/database.config.js";

class CollegeRankingService {
  async listRankings(query = {}) {
    const degreeId = query.degree_id ? parseInt(query.degree_id, 10) : null;

    const whereCondition = {};
    if (degreeId) {
      whereCondition.degree_id = degreeId;
    }

    // First, get all ranking IDs to avoid duplicates from joins
    const rankingIds = await CollegeRanking.findAll({
      where: whereCondition,
      attributes: ["id"],
      order: [
        ["degree_id", "ASC"],
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
          attributes: ["id", "name", "slug", "college_logo", "featured_img"],
          include: [
            {
              model: CollegeAddress,
              as: "collegeAddress",
              required: false,
            },
          ],
        },
        {
          model: Degree,
          as: "degree",
          attributes: ["id", "title", "slug", "short_name", "description"],
          include: [
            {
              model: CollegeRankingParent,
              as: "rankingParent",
            },
          ],
        },
      ],
      order: [
        ["degree_id", "ASC"],
        ["rank", "ASC"],
      ],
    });

    // Group by degree_id and get degree_list_order from rankings
    const grouped = rankings.reduce((acc, ranking) => {
      const degreeId = ranking.degree_id;
      if (!acc[degreeId]) {
        const parent = ranking.degree?.rankingParent;
        acc[degreeId] = {
          degree: ranking.degree,
          degreeListOrder: parent?.degree_list_order || 9999, // Default high order for degrees without order
          description: parent?.description || "",
          content: parent?.content || "",
          slug: parent?.slug || "",
          rankings: [],
        };
      }
      // Double-check to prevent duplicates in the array
      const exists = acc[degreeId].rankings.some((r) => r.id === ranking.id);
      if (!exists) {
        acc[degreeId].rankings.push(ranking);
      }
      return acc;
    }, {});

    // Sort by degree_list_order, then by degree_id
    const sortedGroups = Object.values(grouped).sort((a, b) => {
      if (a.degreeListOrder !== b.degreeListOrder) {
        return a.degreeListOrder - b.degreeListOrder;
      }
      return a.degree.id - b.degree.id;
    });

    return sortedGroups;
  }

  async getRankingsByDegree(degreeId) {
    const rankings = await CollegeRanking.findAll({
      where: { degree_id: degreeId },
      include: [
        {
          model: College,
          as: "college",
          attributes: ["id", "name", "slug", "college_logo", "featured_img"],
          include: [
            {
              model: CollegeAddress,
              as: "collegeAddress",
            },
          ],
        },
        {
          model: Degree,
          as: "degree",
          attributes: ["id", "title", "slug", "short_name", "description"],
          include: [
            {
              model: CollegeRankingParent,
              as: "rankingParent",
            },
          ],
        },
      ],
      order: [["rank", "ASC"]],
    });

    return rankings;
  }

  async createRanking(data) {
    const { degree_id, college_id, rank } = data;

    // Use transaction to prevent race conditions when multiple colleges are added quickly
    const transaction = await sequelize.transaction();

    try {
      // Check if ranking already exists for this degree and college
      const existing = await CollegeRanking.findOne({
        where: {
          degree_id,
          college_id,
        },
        transaction,
      });

      if (existing) {
        const error = new Error("College is already ranked for this degree");
        error.status = 400;
        throw error;
      }

      // Ensure degree has a degree_list_order (set if doesn't exist) in Parent
      const [parent, created] = await CollegeRankingParent.findOrCreate({
        where: { degree_id },
        defaults: { degree_list_order: null },
        transaction,
      });

      let degreeListOrder = parent.degree_list_order;
      if (degreeListOrder === null) {
        // Get current max degree_list_order from Parent
        const maxDegreeOrder =
          (await CollegeRankingParent.max("degree_list_order", {
            transaction,
          })) || 0;
        degreeListOrder = maxDegreeOrder + 1;
        await parent.update(
          { degree_list_order: degreeListOrder },
          { transaction },
        );
      }

      // Get current max rank for this degree within transaction to prevent race conditions
      const maxRank =
        (await CollegeRanking.max("rank", {
          where: { degree_id },
          transaction,
        })) || 0;
      const newRank = rank || maxRank + 1;

      const ranking = await CollegeRanking.create(
        {
          degree_id,
          college_id,
          rank: newRank,
        },
        { transaction },
      );

      await transaction.commit();
      return ranking;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateRankingOrder(degreeId, rankings) {
    // Validate all rankings belong to the degree
    const existingRankings = await CollegeRanking.findAll({
      where: {
        degree_id: degreeId,
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
        { where: { id: ranking.id } },
      ),
    );

    await Promise.all(updates);

    return await this.getRankingsByDegree(degreeId);
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

  async deleteRankingsByDegree(degreeId) {
    await CollegeRanking.destroy({
      where: { degree_id: degreeId },
    });
  }

  async updateDegreeOrder(degreeOrders) {
    const transaction = await sequelize.transaction();
    try {
      // Update degree_list_order for all ranking groups in CollegeRankingParent
      const updates = degreeOrders.map((do_obj) =>
        CollegeRankingParent.update(
          { degree_list_order: do_obj.degree_list_order },
          { where: { degree_id: do_obj.degree_id }, transaction },
        ),
      );

      await Promise.all(updates);
      await transaction.commit();

      return { message: "Degree order updated successfully" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateDegreeDescription(degreeId, description, content, manualSlug) {
    // Find existing parent if any
    const parent = await CollegeRankingParent.findOne({
      where: { degree_id: degreeId },
    });

    let finalSlug = manualSlug;
    if (!finalSlug && !parent?.slug) {
      // If no slug provided and none exists, generate from degree title
      const degree = await Degree.findByPk(degreeId);
      finalSlug = await getUniqueSlug(
        CollegeRankingParent,
        degree.title,
        parent?.id,
        null,
      );
    } else if (finalSlug) {
      // If slug provided, ensure it's unique
      finalSlug = await getUniqueSlug(
        CollegeRankingParent,
        finalSlug,
        parent?.id,
        finalSlug,
      );
    } else {
      // Keep existing slug if none provided in update
      finalSlug = parent?.slug;
    }

    if (parent) {
      await parent.update({ description, content, slug: finalSlug });
    } else {
      await CollegeRankingParent.create({
        degree_id: degreeId,
        description,
        content,
        slug: finalSlug,
      });
    }

    return { message: "Category description updated successfully" };
  }
}

export default CollegeRankingService;
