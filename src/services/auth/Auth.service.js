import bcrypt from "bcrypt";
import crypto from "crypto";

import UserModel from "../../models/users/User.model.js";

class AuthService {
  async registerUser(payload) {
    const transaction = await UserModel.sequelize.transaction();
    try {
      const { firstName, lastName, email, phoneNo, password, roles } = payload;

      const existingUser = await UserModel.findOne({
        where: { email },
        transaction,
      });

      if (existingUser) {
        const error = new Error("Email already exists");
        error.status = 400;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await UserModel.create(
        {
          firstName,
          lastName,
          email,
          phoneNo,
          roles: roles ?? { student: false },
          password: hashedPassword,
          otp,
          otpExpiresAt,
        },
        { transaction }
      );

      await transaction.commit();

      return { email, otp };
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
