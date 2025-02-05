import Joi from "joi";
import UserModel from "../../users/model/UserModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail } from "../../../middleware/MainHelper.js";

export const RegisterUser = async (req, res) => {
  try {
    //Validate request data
    const schema = Joi.object({
      firstName: Joi.string().min(2).max(30).required(),
      middleName: Joi.string().allow(""),
      lastName: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      phoneNo: Joi.string()
        .pattern(/^\d{7,15}$/)
        .required(),
      password: Joi.string().min(6).required(),
      roles: Joi.string()
        .valid("super-admin", "admin", "editor", "teacher", "student")
        .optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { firstName, lastName, email, phoneNo, password, roles } = req.body;

    //Check if user already exists
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    await UserModel.create({
      firstName,
      lastName,
      email,
      phoneNo,
      roles: { student: false },
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });

    // Send OTP via email
    await sendMail(
      email,
      "Your OTP Code",
      `Your OTP is: ${otp}`,
      `<p>Your OTP is: <strong>${otp}</strong></p>`
    );

    return res
      .status(201)
      .json({ message: "User registered successfully. OTP sent to email." });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};
