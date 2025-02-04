import express from "express";

// user controller
import { ListUsers, UserProfile } from "../controllers/ListUsers.js";
import { deleteUser } from "../controllers/DeleteUser.js";
import { updateUserProfile } from "../controllers/EditProfile.js";

// agent controller
import {
  applyForAgentRole,
  reviewAgentRequest,
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
  .delete("/", authenticateUser, deleteUser)
  .put("/edit-profile", updateUserProfile)
  .put("/apply-agent", authenticateUser, applyForAgentRole)
  .put(
    "/review-agent",
    authenticateUser,
    authorizeRole(["admin", "super-admin"]),
    reviewAgentRequest
  );

export default route;
