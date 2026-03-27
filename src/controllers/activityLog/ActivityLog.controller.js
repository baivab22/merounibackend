import ActivityLogModel from "../../models/activityLog/ActivityLog.model.js";
import UserModel from "../../models/users/User.model.js";
import { Op, Sequelize } from "sequelize";

class ActivityLogController {
  async getActivityLogs(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const { q, role, userIds } = req.query;

      const whereClause = {};
      
      if (q) {
        whereClause[Op.or] = [
          { action: { [Op.like]: `%${q}%` } },
          { resource: { [Op.like]: `%${q}%` } },
          { "$user.first_name$": { [Op.like]: `%${q}%` } },
          { "$user.last_name$": { [Op.like]: `%${q}%` } },
          { "$user.email$": { [Op.like]: `%${q}%` } },
        ];
      }
      
      if (userIds) {
        const idArray = userIds.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        if (idArray.length > 0) {
          whereClause.user_id = { [Op.in]: idArray };
        }
      }

      const userWhereClause = {};
      if (role && (role === 'admin' || role === 'editor')) {
        // Querying JSON field natively
        userWhereClause.roles = Sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(roles, '$.${role}')) = 'true'`);
      }

      const { count, rows } = await ActivityLogModel.findAndCountAll({
        limit,
        offset,
        where: whereClause,
        order: [["createdAt", "DESC"]],
        subQuery: false, // required when filtering on included model fields with limit
        include: [
          {
            model: UserModel,
            as: "user",
            attributes: ["id", "first_name", "last_name", "email", "roles"],
            where: Object.keys(userWhereClause).length > 0 ? userWhereClause : undefined,
          },
        ],
      });

      return res.status(200).json({
        status: 200,
        message: "Activity logs fetched successfully",
        data: rows,
        pagination: {
          totalItems: count, // this might be incorrect due to subQuery: false with joins, but standard approach
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        details: error.message,
      });
    }
  }
}

export default new ActivityLogController();
