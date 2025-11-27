import UserModel from "../../users/model/UserModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Sequelize } from "sequelize";

import { registerHelper } from "../helper/AuthHelper.js";
import { sendMail } from "../../../middleware/MainHelper.js";

export const RegisterUser = async (req, res) => {
  let transaction;
  try {
    const response = registerHelper(req.body);
    if (response.error) {
      return res
        .status(400)
        .json({ message: response.error.details[0].message });
    }

    const { firstName, lastName, email, phoneNo, password, roles } = req.body;

    // Start a transaction
    transaction = await UserModel.sequelize.transaction();

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      where: { email },
      transaction, // Include transaction in the query
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create user within the transaction
    await UserModel.create(
      {
        firstName,
        lastName,
        email,
        phoneNo,
        roles: { admin: true } ?? { student: false },
        password: hashedPassword,
        otp,
        otpExpiresAt,
      },
      { transaction }
    );

    // Send OTP via email
    await sendMail(
      email,
      "Your OTP Code",
      `Your OTP is: ${otp}`,
      `<p>Your OTP is: <strong>${otp}</strong></p>`
    );

    // If everything is successful, commit the transaction
    await transaction.commit();

    return res
      .status(201)
      .json({ message: "User registered successfully. OTP sent to email." });
  } catch (error) {
    // If any error occurs, rollback the transaction
    if (transaction) await transaction.rollback();

    console.error("Error:", error);

    // Handle specific error types
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};
