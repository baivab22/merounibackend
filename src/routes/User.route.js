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
  listUsersQuerySchema,
  deleteUserBodySchema,
  updateUserProfileQuerySchema,
  updateUserProfileBodySchema,
  applyForAgentRoleSchema,
  reviewAgentRequestSchema,
  createCollegeCredentialsSchema,
} from "../validators/user/User.validator.js";

const route = express.Router();

route
  .get(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(listUsersQuerySchema, "query"),
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
    authorizeRole(["admin"]),
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
    authorizeRole(["admin"]),
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
    authorizeRole(["admin"]),
    requestValidator(reviewAgentRequestSchema, "body"),
    UserController.reviewAgentRequest
  )
  .post(
    "/college-credentials",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(createCollegeCredentialsSchema, "body"),
    UserController.createCollegeCredentials
  );

export default route;
