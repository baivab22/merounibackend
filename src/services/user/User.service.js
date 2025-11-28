import bcrypt from "bcrypt";
import { Op, Sequelize } from "sequelize";
import { Parser } from "json2csv";

import UserModel from "../../models/users/User.model.js";
import { roleHelper } from "../../utils/RoleHelper.js";

class UserService {
  async listUsers(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();
    const search = query.q;

    const whereCondition = {};
    if (search) {
      whereCondition[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
        { firstName: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await UserModel.findAndCountAll({
      where: whereCondition,
      order: [["id", sort]],
      distinct: true,
      limit,
      offset,
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
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

  async getUserProfile(userId) {
    const user = await UserModel.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return user;
  }

  async exportUsers(query = {}) {
    const limit = parseInt(query.limit, 10) || 100;
    const startDate = query.start_date;
    const endDate = query.end_date;
    const roleFilter = query.role;

    const whereCondition = {};

    if (startDate || endDate) {
      whereCondition.createdAt = {};
      if (startDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        whereCondition.createdAt[Op.gte] = startOfDay;
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        whereCondition.createdAt[Op.lte] = endOfDay;
      }
    }

    if (roleFilter) {
      whereCondition[Op.and] = [
        Sequelize.literal(
          `JSON_UNQUOTE(JSON_EXTRACT(roles, '$.${roleFilter}')) = 'true'`
        ),
      ];
    }

    const users = await UserModel.findAll({
      where: whereCondition,
      limit,
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "email",
        "phoneNo",
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "createdAt"],
      ],
    });

    const fields = [
      { label: "First Name", value: "firstName" },
      { label: "Middle Name", value: "middleName" },
      { label: "Last Name", value: "lastName" },
      { label: "E-mail", value: "email" },
      { label: "Phone No.", value: "phoneNo" },
      { label: "Registered Date", value: "createdAt" },
    ];

    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(users);
  }

  async deleteUser(userId, loggedInUser) {
    if (!userId) {
      const error = new Error("User ID is required");
      error.status = 400;
      throw error;
    }

    const loggedInUserRoles = roleHelper(loggedInUser?.role);
    const isAdmin =
      loggedInUserRoles?.admin || loggedInUserRoles?.["super-admin"];

    if (!isAdmin && loggedInUser?.id !== Number(userId)) {
      const error = new Error("You are not allowed to delete this account!");
      error.status = 403;
      throw error;
    }

    const user = await UserModel.findByPk(userId);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    await user.destroy();
  }

  async updateUserProfile(userId, updates) {
    if (!userId) {
      const error = new Error("User ID is required");
      error.status = 400;
      throw error;
    }

    const user = await UserModel.findByPk(userId);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    await user.update(updates);
  }

  async listPendingAgentRole(query = {}) {
    const role = query.role || "agent";
    let page = parseInt(query.page, 10) || 1;
    let limit = parseInt(query.limit, 10) || 10;
    const sort = query.sort?.toLowerCase() === "desc" ? "DESC" : "ASC";

    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await UserModel.findAndCountAll({
      order: [["id", sort]],
      limit,
      offset,
      where: Sequelize.literal(`JSON_CONTAINS(pending_roles, '"${role}"')`),
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
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

  async applyForAgentRole(payload, requester) {
    const userId = payload.user_id || requester?.id;

    if (!userId) {
      const error = new Error("User ID is required");
      error.status = 400;
      throw error;
    }

    const user = await UserModel.findByPk(userId);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    let pendingRoles =
      typeof user.pendingRoles === "string"
        ? JSON.parse(user.pendingRoles)
        : user.pendingRoles;

    if (!Array.isArray(pendingRoles)) pendingRoles = [];

    if (pendingRoles.includes("agent")) {
      const error = new Error("You have already applied for the Agent role.");
      error.status = 400;
      throw error;
    }

    pendingRoles.push("agent");

    await user.update({ pendingRoles });
  }

  async reviewAgentRequest(payload, loggedInUser) {
    const { user_id, action } = payload;

    if (!loggedInUser) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    const loggedInUserRoles = roleHelper(loggedInUser.role);

    if (!loggedInUserRoles?.admin && !loggedInUserRoles?.["super-admin"]) {
      const error = new Error(
        "Access denied. Only admins can review role requests."
      );
      error.status = 403;
      throw error;
    }

    const user = await UserModel.findByPk(user_id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    let roles =
      typeof user.roles === "string" ? JSON.parse(user.roles) : user.roles;
    let pendingRoles =
      typeof user.pendingRoles === "string"
        ? JSON.parse(user.pendingRoles)
        : user.pendingRoles;

    if (!Array.isArray(pendingRoles)) pendingRoles = [];
    if (!roles || typeof roles !== "object") roles = {};

    if (!pendingRoles.includes("agent")) {
      const error = new Error("No pending Agent role request found.");
      error.status = 400;
      throw error;
    }

    if (action === "approve") {
      roles.agent = true;
      pendingRoles = pendingRoles.filter((role) => role !== "agent");
    } else if (action === "reject") {
      pendingRoles = pendingRoles.filter((role) => role !== "agent");
    } else {
      const error = new Error("Invalid action. Use 'approve' or 'reject'.");
      error.status = 400;
      throw error;
    }

    await user.update({ roles, pendingRoles });
    return user;
  }
}

export default UserService;
