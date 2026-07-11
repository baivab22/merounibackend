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
      const rolesArray = role.split(",");
      if (rolesArray.length > 0) {
        const roleConditions = rolesArray.map((r) =>
          Sequelize.where(
            Sequelize.literal(`JSON_EXTRACT(roles, '$.${r.trim()}')`),
            true,
          ),
        );
        whereConditions.push({ [Op.or]: roleConditions });
      }
    }

    // Filter by education level if provided
    if (query.education_level) {
      const levels = query.education_level.split(",").map((l) => l.trim()).filter(Boolean);
      if (levels.length > 0) {
        whereConditions.push({
          educationLevel: { [Op.in]: levels },
        });
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

  async listPendingAgents(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await UserModel.findAndCountAll({
      where: Sequelize.literal(`JSON_CONTAINS(pending_roles, '"agent"') = 1`),
      order: [["createdAt", "DESC"]],
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
    const educationLevelFilter = query.education_level;

    const whereConditions = [];

    if (startDate || endDate) {
      const createdAtFilter = {};
      if (startDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        createdAtFilter[Op.gte] = startOfDay;
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        createdAtFilter[Op.lte] = endOfDay;
      }
      whereConditions.push({ createdAt: createdAtFilter });
    }

    if (roleFilter) {
      const rolesArray = roleFilter.split(",");
      if (rolesArray.length > 0) {
        const roleConditions = rolesArray.map((r) =>
          Sequelize.where(
            Sequelize.literal(`JSON_EXTRACT(roles, '$.${r.trim()}')`),
            true,
          ),
        );
        whereConditions.push({ [Op.or]: roleConditions });
      }
    }

    if (educationLevelFilter) {
      const levels = educationLevelFilter.split(",").map((l) => l.trim()).filter(Boolean);
      if (levels.length > 0) {
        whereConditions.push({
          educationLevel: { [Op.in]: levels },
        });
      }
    }

    const whereCondition =
      whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    const users = await UserModel.findAll({
      where: whereCondition,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "email",
        "phoneNo",
        "educationLevel",
        "furtherEducationPlan",
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "createdAt"],
      ],
    });

    const fields = [
      { label: "First Name", value: "firstName" },
      { label: "Middle Name", value: "middleName" },
      { label: "Last Name", value: "lastName" },
      { label: "E-mail", value: "email" },
      { label: "Phone No.", value: "phoneNo" },
      { label: "Education Level", value: "educationLevel" },
      { label: "Future Plan", value: "furtherEducationPlan" },
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
    const changedValues = {};
    if (updates.firstName) {
      changedValues.firstName = updates.firstName;
    }
    if (updates.middleName) {
      changedValues.middleName = updates.middleName;
    }
    if (updates.lastName) {
      changedValues.lastName = updates.lastName;
    }
    if (updates.phoneNo) {
      changedValues.phoneNo = updates.phoneNo;
    }
    changedValues.profileImageUrl = updates.profileImageUrl;

    changedValues.cvUrl = updates.cvUrl;

    await UserModel.update(changedValues, { where: { id: userId } });
    return true;
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
        "Access denied. Only admins can review role requests.",
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

    // Check if a user for this college already exists
    const existingCollegeUser = await UserModel.findOne({
      where: {
        collegeId: collegeId,
        roles: Sequelize.literal("JSON_EXTRACT(roles, '$.institution') = true"),
      },
    });

    // Check if email is already used by ANOTHER user
    const emailCondition = { email };
    if (existingCollegeUser) {
      emailCondition.id = { [Op.ne]: existingCollegeUser.id };
    }
    const emailInUse = await UserModel.findOne({ where: emailCondition });
    if (emailInUse) {
      const error = new Error("User with this email already exists");
      error.status = 400;
      throw error;
    }

    // Check if phone is already used by ANOTHER user
    const phoneCondition = { phoneNo };
    if (existingCollegeUser) {
      phoneCondition.id = { [Op.ne]: existingCollegeUser.id };
    }
    const phoneInUse = await UserModel.findOne({ where: phoneCondition });
    if (phoneInUse) {
      const error = new Error("User with this phone number already exists");
      error.status = 400;
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (existingCollegeUser) {
      // Update existing user
      await existingCollegeUser.update({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNo,
        roles: { institution: true },
        createdByAdmin: true,
      });
      return existingCollegeUser;
    } else {
      // Create new user
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
  }

  async createConsultancyCredentials(payload) {
    const { firstName, lastName, email, password, phoneNo, consultancyId } =
      payload;

    if (!firstName || !lastName || !email || !password || !phoneNo) {
      const error = new Error("All fields are required");
      error.status = 400;
      throw error;
    }

    // Check if a user for this consultancy already exists
    const existingConsultancyUser = await UserModel.findOne({
      where: {
        consultancyId: consultancyId,
        roles: Sequelize.literal("JSON_EXTRACT(roles, '$.consultancy') = true"),
      },
    });

    // Check if email is already used by ANOTHER user
    const emailCondition = { email };
    if (existingConsultancyUser) {
      emailCondition.id = { [Op.ne]: existingConsultancyUser.id };
    }
    const emailInUse = await UserModel.findOne({ where: emailCondition });
    if (emailInUse) {
      const error = new Error("User with this email already exists");
      error.status = 400;
      throw error;
    }

    // Check if phone is already used by ANOTHER user
    const phoneCondition = { phoneNo };
    if (existingConsultancyUser) {
      phoneCondition.id = { [Op.ne]: existingConsultancyUser.id };
    }
    const phoneInUse = await UserModel.findOne({ where: phoneCondition });
    if (phoneInUse) {
      const error = new Error("User with this phone number already exists");
      error.status = 400;
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (existingConsultancyUser) {
      // Update existing user
      await existingConsultancyUser.update({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNo,
        roles: { consultancy: true }, // Ensure role is set
        createdByAdmin: true,
      });
      return existingConsultancyUser;
    } else {
      // Create new user
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
}

export default UserService;
