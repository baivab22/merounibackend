import express from "express";

import UserController from "../controllers/user/User.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    UserController.listUsers
  )
  .get("/export", UserController.exportUsers)
  .get("/profile", authenticateUser, UserController.getUserProfile)
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    UserController.deleteUser
  )
  .put("/edit-profile", UserController.updateUserProfile)
  .get(
    "/pending-role",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    UserController.listPendingAgentRole
  )
  .put("/apply-agent", authenticateUser, UserController.applyForAgentRole)
  .put(
    "/review-agent",
    authenticateUser,
    authorizeRole(["admin", "super-admin"]),
    UserController.reviewAgentRequest
  );

export default route;
