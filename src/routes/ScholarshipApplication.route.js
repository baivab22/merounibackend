import express from "express";
import ScholarshipApplicationController from "../controllers/scholarship-application/ScholarshipApplication.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  applyForScholarshipSchema,
  updateApplicationStatusSchema,
  idParamSchema,
} from "../validators/scholarship-application/ScholarshipApplication.validator.js";

const route = express.Router();

/**
 * @swagger
 * /scholarship-application/apply:
 *   post:
 *     summary: Apply for a scholarship
 *     tags: [Scholarship Applications]
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
 *               - scholarshipId
 *             properties:
 *               scholarshipId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request (already applied or deadline passed)
 *       404:
 *         description: Scholarship or student not found
 */
route.post(
  "/apply",
  authenticateUser,
  requestValidator(applyForScholarshipSchema, "body"),
  ScholarshipApplicationController.applyForScholarship
);

/**
 * @swagger
 * /scholarship-application/my-applications:
 *   get:
 *     summary: Get current user's scholarship applications
 *     tags: [Scholarship Applications]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: List of applications
 */
route.get(
  "/my-applications",
  authenticateUser,
  requestValidator(paginationSchema, "query"),
  ScholarshipApplicationController.getStudentApplications
);

/**
 * @swagger
 * /scholarship-application:
 *   get:
 *     summary: Get all scholarship applications (admin only)
 *     tags: [Scholarship Applications]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *       - in: query
 *         name: scholarshipId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of all applications
 */
route.get(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(paginationSchema, "query"),
  ScholarshipApplicationController.getAllApplications
);

/**
 * @swagger
 * /scholarship-application/{applicationId}/status:
 *   patch:
 *     summary: Update application status (admin only)
 *     tags: [Scholarship Applications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
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
 *                 enum: [PENDING, APPROVED, REJECTED]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application status updated
 *       404:
 *         description: Application not found
 */
route.patch(
  "/:applicationId/status",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(idParamSchema, "params"),
  requestValidator(updateApplicationStatusSchema, "body"),
  ScholarshipApplicationController.updateApplicationStatus
);

/**
 * @swagger
 * /scholarship-application/{applicationId}:
 *   delete:
 *     summary: Delete a scholarship application (student can delete their own)
 *     tags: [Scholarship Applications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       403:
 *         description: Forbidden (not the owner)
 *       404:
 *         description: Application not found
 */
route.delete(
  "/:applicationId",
  authenticateUser,
  requestValidator(idParamSchema, "params"),
  ScholarshipApplicationController.deleteApplication
);

export default route;
