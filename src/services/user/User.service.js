import bcrypt from "bcryptjs";
import { Op, Sequelize } from "sequelize";
import { Parser } from "json2csv";

import UserModel from "../../models/users/User.model.js";
import { roleHelper } from "../../utils/RoleHelper.js";

class UserService {
  async listUsers(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "desc").toUpperCase();
    const search = query.q;
    const role = query.role;

    const whereConditions = [];

    if (search) {
      whereConditions.push({
        [Op.or]: [
          { email: { [Op.like]: `%${search}%` } },
          { firstName: { [Op.like]: `%${search}%` } },
        ],
      });
    }

    // Filter by role if provided
    if (role) {
      const rolesArray = role.split(',');
      if (rolesArray.length > 0) {
        const roleConditions = rolesArray.map(r => 
          Sequelize.where(
            Sequelize.literal(`JSON_EXTRACT(roles, '$.${r.trim()}')`),
            true
          )
        );
        whereConditions.push({ [Op.or]: roleConditions });
      }
    }

    const whereCondition =
      whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await UserModel.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", sort]],
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
      const rolesArray = roleFilter.split(',');
      if (rolesArray.length > 0) {
        const roleConditions = rolesArray.map(r => 
          Sequelize.literal(
            `JSON_UNQUOTE(JSON_EXTRACT(roles, '$.${r.trim()}')) = 'true'`
          )
        );
        whereCondition[Op.and] = [{ [Op.or]: roleConditions }];
      }
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
    const isAdmin = loggedInUserRoles?.admin;

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

    async updateUserDetails(userId, updates) {
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
    const changedValues = {}
    if (updates.firstName) {
      changedValues.firstName = updates.firstName
    }
    if (updates.middleName) {
      changedValues.middleName = updates.middleName
    }
    if (updates.lastName) {
      changedValues.lastName = updates.lastName
    }
    if (updates.phoneNo) {
      changedValues.phoneNo = updates.phoneNo
    }
    changedValues.profileImageUrl = updates.profileImageUrl
    
    changedValues.cvUrl = updates.cvUrl
    

      await UserModel.update(changedValues, { where: { id: userId } })
      return true
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

    if (!loggedInUserRoles?.admin) {
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

  async createCollegeCredentials(payload) {
    const { firstName, lastName, email, password, phoneNo, collegeId } =
      payload;

    if (!firstName || !lastName || !email || !password || !phoneNo) {
      const error = new Error("All fields are required");
      error.status = 400;
      throw error;
    }

    // Check if user with email already exists
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.status = 400;
      throw error;
    }

    // Check if user with phone already exists
    const existingPhone = await UserModel.findOne({ where: { phoneNo } });
    if (existingPhone) {
      const error = new Error("User with this phone number already exists");
      error.status = 400;
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with institution role, created_by_admin flag, and college_id
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo,
      roles: { institution: true },
      createdByAdmin: true,
      collegeId: collegeId || null,
    });

    return user;
  }

   async createConsultancyCredentials(payload) {
    const { firstName, lastName, email, password, phoneNo, consultancyId } =
      payload;

    if (!firstName || !lastName || !email || !password || !phoneNo) {
      const error = new Error("All fields are required");
      error.status = 400;
      throw error;
    }

    // Check if user with email already exists
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.status = 400;
      throw error;
    }

    // Check if user with phone already exists
    const existingPhone = await UserModel.findOne({ where: { phoneNo } });
    if (existingPhone) {
      const error = new Error("User with this phone number already exists");
      error.status = 400;
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with consultancy role, created_by_admin flag, and consultancy_id
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo,
      roles: { consultancy: true },
      createdByAdmin: true,
      consultancyId: consultancyId || null,
    });

    return user;
  }
}

export default UserService;
