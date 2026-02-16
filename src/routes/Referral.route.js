import express from "express";

import ReferralController from "../controllers/referral/Referral.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  createSelfApplicationSchema,
  createReferredApplicationSchema,
  applicationTypeParamSchema,
  collegeIdParamSchema,
  collegeIdAndTypeParamSchema,
  referralIdParamSchema,
  updateReferralStatusSchema,
  checkIfAlreadyAppliedForCollageQuerySchema,
} from "../validators/referral/Referral.validator.js";

const router = express.Router();

/**
 * @swagger
 * /referral/self-apply:
 *   post:
 *     summary: Create a self-application (student applies directly)
 *     tags: [Referrals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - college_id
 *               - course_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               college_id:
 *                 type: integer
 *               course_id:
 *                 type: integer
 *               student_description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Self-application created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/self-apply",
  authenticateUser,
  requestValidator(createSelfApplicationSchema, "body"),
  ReferralController.createSelfApplication,
);

/**
 * @swagger
 * /referral/check-if-already-applied-for-collage:
 *   post:
 *     summary: Check if user has already applied for a college
 *     tags: [Referrals]
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
 *       200:
 *         description: Returns true if user has already applied, false otherwise
 *       400:
 *         description: Bad request
 */
router.get(
  "/check-if-already-applied-for-collage",
  authenticateUser,
  requestValidator(checkIfAlreadyAppliedForCollageQuerySchema, "query"),
  ReferralController.checkIfAlreadyAppliedForCollage,
);

/**
 * @swagger
 * /referral/agent-apply:
 *   post:
 *     summary: Create a referred application (agent refers a student)
 *     tags: [Referrals]
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
 *               - student_id
 *               - college_id
 *               - course_id
 *             properties:
 *               student_id:
 *                 type: integer
 *               college_id:
 *                 type: integer
 *               course_id:
 *                 type: integer
 *               student_description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Referred application created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/agent-apply",
  authenticateUser,
  authorizeRole(["admin", "editor", "agent"]),
  requestValidator(createReferredApplicationSchema, "body"),
  ReferralController.createReferredApplication,
);

/**
 * @swagger
 * /referral:
 *   get:
 *     summary: Get all applications (Admin/Editor/Agent only)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all applications
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor", "agent"]),
  ReferralController.getApplications,
);

/**
 * @swagger
 * /referral/user/referrals:
 *   get:
 *     summary: Get user's own referrals/applications
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's referrals
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/user/referrals",
  authenticateUser,
  ReferralController.getUserReferrals,
);

/**
 * @swagger
 * /referral/institution/applications:
 *   get:
 *     summary: Get applications for institution's college (Institution only)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of applications for the institution
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/institution/applications",
  authenticateUser,
  authorizeRole(["institution"]),
  ReferralController.getInstitutionApplications,
);

/**
 * @swagger
 * /referral/type/{type}:
 *   get:
 *     summary: Get applications by type (Admin/Editor/Agent only)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [self, referred]
 *     responses:
 *       200:
 *         description: List of applications filtered by type
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/type/:type",
  authenticateUser,
  authorizeRole(["admin", "editor", "agent"]),
  requestValidator(applicationTypeParamSchema, "params"),
  ReferralController.getApplicationsByType,
);

/**
 * @swagger
 * /referral/college/{college_id}:
 *   get:
 *     summary: Get applications for a specific college (Admin only)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: college_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of applications for the college
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/college/:college_id",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(collegeIdParamSchema, "params"),
  ReferralController.getCollegeApplications,
);

/**
 * @swagger
 * /referral/college/{college_id}/type/{type}:
 *   get:
 *     summary: Get applications for a college by type (Admin only)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: college_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [self, referred]
 *     responses:
 *       200:
 *         description: List of applications filtered by college and type
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/college/:college_id/type/:type",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(collegeIdAndTypeParamSchema, "params"),
  ReferralController.getCollegeApplicationsByType,
);

/**
 * @swagger
 * /referral/{id}/status:
 *   patch:
 *     summary: Update referral/application status
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ACCEPTED, REJECTED]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Referral not found
 */
router.patch(
  "/:id/status",
  authenticateUser,
  authorizeRole(["admin", "editor", "agent", "institution"]),
  requestValidatorMultiple([
    { schema: referralIdParamSchema, property: "params" },
    { schema: updateReferralStatusSchema, property: "body" },
  ]),
  ReferralController.updateStatus,
);

/**
 * @swagger
 * /referral/{id}:
 *   delete:
 *     summary: Delete a referral/application
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Referral deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Referral not found
 */
/**
 * @swagger
 * /referral/top-agents:
 *   get:
 *     summary: Get top agents by referral score (admin only)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of top agents to return
 *     responses:
 *       200:
 *         description: Top agents retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/top-agents",
  authenticateUser,
  authorizeRole(["admin"]),
  ReferralController.getTopAgents,
);

router.delete(
  "/:id",
  authenticateUser,
  // Allow students to delete their own applications, admins/editors/agents can delete any
  requestValidator(referralIdParamSchema, "params"),
  ReferralController.deleteReferral,
);

export default router;
