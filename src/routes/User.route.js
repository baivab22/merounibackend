import express from "express";

import UserController from "../controllers/user/User.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  getUserProfileQuerySchema,
  exportUsersQuerySchema,
  deleteUserBodySchema,
  updateUserProfileQuerySchema,
  updateUserProfileBodySchema,
  applyForAgentRoleSchema,
  reviewAgentRequestSchema,
} from "../validators/user/User.validator.js";

const route = express.Router();

route
  .get(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    requestValidator(paginationSchema, "query"),
    UserController.listUsers
  )
  .get(
    "/export",
    requestValidator(exportUsersQuerySchema, "query"),
    UserController.exportUsers
  )
  .get(
    "/profile",
    authenticateUser,
    requestValidator(getUserProfileQuerySchema, "query"),
    UserController.getUserProfile
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    requestValidator(deleteUserBodySchema, "body"),
    UserController.deleteUser
  )
  .put(
    "/edit-profile",
    requestValidatorMultiple([
      { schema: updateUserProfileQuerySchema, property: "query" },
      { schema: updateUserProfileBodySchema, property: "body" },
    ]),
    UserController.updateUserProfile
  )
  .get(
    "/pending-role",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    requestValidator(paginationSchema, "query"),
    UserController.listPendingAgentRole
  )
  .put(
    "/apply-agent",
    authenticateUser,
    requestValidator(applyForAgentRoleSchema, "body"),
    UserController.applyForAgentRole
  )
  .put(
    "/review-agent",
    authenticateUser,
    authorizeRole(["admin", "super-admin"]),
    requestValidator(reviewAgentRequestSchema, "body"),
    UserController.reviewAgentRequest
  );

export default route;
