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
  createConsultancyCredentialsSchema,
  updateUserDetailsBodySchema
} from "../validators/user/User.validator.js";
import { changePasswordSchema } from "../validators/user/Password.validator.js";

const route = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.get(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(listUsersQuerySchema, "query"),
  UserController.listUsers
);

/**
 * @swagger
 * /users/export:
 *   get:
 *     summary: Export users to CSV
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
route.get(
  "/export",
  requestValidator(exportUsersQuerySchema, "query"),
  UserController.exportUsers
);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
route.get(
  "/profile",
  authenticateUser,
  requestValidator(getUserProfileQuerySchema, "query"),
  UserController.getUserProfile
);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteUserBodySchema, "body"),
  UserController.deleteUser
);

/**
 * @swagger
 * /users/edit-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
route.put(
  "/edit-profile",
  requestValidatorMultiple([
    { schema: updateUserProfileQuerySchema, property: "query" },
    { schema: updateUserProfileBodySchema, property: "body" },
  ]),
  UserController.updateUserProfile
);

/**
 * @swagger
 * /users/edit-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
route.put(
  "/edit-userdetails",
  authenticateUser,
  requestValidatorMultiple([
    { schema: updateUserDetailsBodySchema, property: "body" },
  ]),

  UserController.updateUserDetails
);

/**
 * @swagger
 * /users/pending-role:
 *   get:
 *     summary: List pending agent role requests (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of pending requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.get(
  "/pending-role",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(paginationSchema, "query"),
  UserController.listPendingAgentRole
);

/**
 * @swagger
 * /users/apply-agent:
 *   put:
 *     summary: Apply for agent role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - college_id
 *             properties:
 *               college_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
route.put(
  "/apply-agent",
  authenticateUser,
  requestValidator(applyForAgentRoleSchema, "body"),
  UserController.applyForAgentRole
);

/**
 * @swagger
 * /users/review-agent:
 *   put:
 *     summary: Review agent role request (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - status
 *             properties:
 *               user_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Request reviewed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.put(
  "/review-agent",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(reviewAgentRequestSchema, "body"),
  UserController.reviewAgentRequest
);

/**
 * @swagger
 * /users/college-credentials:
 *   post:
 *     summary: Create college credentials for a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - college_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               college_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Credentials created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.post(
  "/college-credentials",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(createCollegeCredentialsSchema, "body"),
  UserController.createCollegeCredentials
);

/**
 * @swagger
 * /users/consultancy-credentials:
 *   post:
 *     summary: Create consultancy credentials for a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - consultancy_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               consultancy_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Credentials created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.post(
  "/consultancy-credentials",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(createConsultancyCredentialsSchema, "body"),
  UserController.createConsultancyCredentials
);


/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
route.put(
  "/change-password",
  authenticateUser,
  requestValidator(changePasswordSchema, "body"),
  UserController.changePassword
);

export default route;
