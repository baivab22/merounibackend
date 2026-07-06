import bcrypt from "bcryptjs";
import crypto from "crypto";

import UserModel from "../../models/users/User.model.js";

class AuthService {
  async registerUser(payload) {
    const transaction = await UserModel.sequelize.transaction();
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNo,
        password,
        role = "student",
        agent_experience,
        education_level,
        further_education_plan,
        roles,
        created_by_admin,
      } = payload;

      const existingUser = await UserModel.findOne({
        where: { email },
        transaction,
      });

      if (existingUser) {
        const error = new Error("Email already exists");
        error.status = 400;
        throw error;
      }

      const sameContact = await UserModel.findOne({ where: { phoneNo } });
      if (sameContact) {
        const error = new Error("Phone number already exists");
        error.status = 400;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      let rolesObject;
      let pendingRoles = [];

      if (created_by_admin === 1 || created_by_admin === true) {
        rolesObject = roles
          ? typeof roles === "string"
            ? { [roles]: true }
            : typeof roles === "object" && Object.keys(roles).length > 0
              ? roles
              : { student: true }
          : { student: true };
        pendingRoles = [];
      } else if (role === "agent") {
        rolesObject = {};
        pendingRoles = ["agent"];
      } else {
        rolesObject = { student: true };
        pendingRoles = [];
      }

      const createData = {
        firstName,
        lastName,
        email,
        phoneNo,
        roles: rolesObject,
        pendingRoles,
        password: hashedPassword,
        otp,
        otpExpiresAt,
        createdByAdmin: created_by_admin === 1 || created_by_admin === true,
      };

      if (role === "agent" && agent_experience) {
        createData.agentExperience = agent_experience;
      }

      if (education_level) {
        createData.educationLevel = education_level;
      }

      if (further_education_plan) {
        createData.furtherEducationPlan = further_education_plan;
      }

      const user = await UserModel.create(createData, { transaction });

      await transaction.commit();

      return { email, otp, user };
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  async authenticateCredentials(email, password) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      const error = new Error(`User not found of ${email}`);
      error.status = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const error = new Error("Password didn't matched");
      error.status = 401;
      throw error;
    }

    return user;
  }

  async getUserByEmail(email) {
    return UserModel.findOne({ where: { email } });
  }

  async updateUser(where, data) {
    return UserModel.update(data, { where });
  }
}

export default AuthService;
