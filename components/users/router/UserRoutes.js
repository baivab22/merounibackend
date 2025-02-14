import express from "express";

// user controller
import { ListUsers, UserProfile } from "../controllers/ListUsers.js";
import { deleteUser } from "../controllers/DeleteUser.js";
import { updateUserProfile } from "../controllers/EditProfile.js";

// agent controller
import {
  applyForAgentRole,
  reviewAgentRequest,
  listPendingAgentRole,
} from "../controllers/AgentController.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    ListUsers
  )
  .get("/profile", authenticateUser, UserProfile)
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteUser
  )
  .put("/edit-profile", authenticateUser, updateUserProfile)
  .get(
    "/pending-role",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    listPendingAgentRole
  )
  .put("/apply-agent", authenticateUser, applyForAgentRole)
  .put(
    "/review-agent",
    authenticateUser,
    authorizeRole(["admin", "super-admin"]),
    reviewAgentRequest
  );

export default route;
