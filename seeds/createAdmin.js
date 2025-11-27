import dotenv from "dotenv";
import bcrypt from "bcrypt";

import { sequelize, authenticate } from "../config/database.js";
import UserModel from "../components/users/model/UserModel.js";

dotenv.config();

const {
  SEED_ADMIN_FIRST_NAME = "Admin",
  SEED_ADMIN_LAST_NAME = "User",
  SEED_ADMIN_EMAIL = "admin@example.com",
  SEED_ADMIN_PHONE = "9800000000",
  SEED_ADMIN_PASSWORD = "ChangeMe123!",
} = process.env;

async function ensureAdminUser() {
  await authenticate();

  try {
    const existingUser = await UserModel.findOne({
      where: { email: SEED_ADMIN_EMAIL },
    });

    if (existingUser) {
      console.log(`Admin already exists with email ${SEED_ADMIN_EMAIL}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);

    await UserModel.create({
      firstName: SEED_ADMIN_FIRST_NAME,
      lastName: SEED_ADMIN_LAST_NAME,
      middleName: null,
      email: SEED_ADMIN_EMAIL,
      password: hashedPassword,
      phoneNo: SEED_ADMIN_PHONE,
      roles: {
        admin: true,
        "super-admin": true,
        editor: false,
        agent: false,
        student: false,
        "college-admin": false,
      },
      pendingRoles: [],
    });

    console.log(`Admin user created with email ${SEED_ADMIN_EMAIL}`);
  } catch (error) {
    console.error("Failed to seed admin user:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

ensureAdminUser();
