import express from "express";

import CareerGuidanceController from "../controllers/career-guidance/CareerGuidance.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  listCareerGuidanceSchema,
  createCareerGuidanceSchema,
  updateCareerGuidanceStatusSchema,
  idQuerySchema,
} from "../validators/career-guidance/CareerGuidance.validator.js";

const route = express.Router();

/**
 * @swagger
 * /career-guidance:
 *   get:
 *     summary: List career guidance submissions (Admin only)
 *     tags: [Career Guidance]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of career guidance submissions
 */
route.get(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(listCareerGuidanceSchema, "query"),
  CareerGuidanceController.listSubmissions
);

/**
 * @swagger
 * /career-guidance:
 *   post:
 *     summary: Request a career guidance session
 *     tags: [Career Guidance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - phone
 *               - desired_course
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               desired_course:
 *                 type: string
 *     responses:
 *       201:
 *         description: Career guidance session requested successfully
 *       400:
 *         description: Bad request
 */
route.post(
  "/",
  requestValidator(createCareerGuidanceSchema, "body"),
  CareerGuidanceController.createSubmission
);

/**
 * @swagger
 * /career-guidance/update-status:
 *   patch:
 *     summary: Update career guidance submission status (Admin only)
 *     tags: [Career Guidance]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
route.patch(
  "/update-status",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(idQuerySchema, "query"),
  requestValidator(updateCareerGuidanceStatusSchema, "body"),
  CareerGuidanceController.updateStatus
);

/**
 * @swagger
 * /career-guidance:
 *   delete:
 *     summary: Delete a career guidance submission (Admin only)
 *     tags: [Career Guidance]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Submission deleted successfully
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(idQuerySchema, "query"),
  CareerGuidanceController.deleteSubmission
);

export default route;
