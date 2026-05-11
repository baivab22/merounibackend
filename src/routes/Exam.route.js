import express from "express";

import ExamController from "../controllers/exam/Exam.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  createOrUpdateExamSchema,
  examIdParamSchema,
  examSlugParamSchema,
  listExamsSchema
} from "../validators/exam/Exam.validator.js";

const router = express.Router();

/**
 * @swagger
 * /exam:
 *   get:
 *     summary: List all exams with pagination
 *     tags: [Exams]
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
 *         name: levelId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: universityId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isOpen
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isUpcoming
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: List of exams
 */
router.get(
  "/",
  requestValidator(listExamsSchema, "query"),
  ExamController.listExams
);

/**
 * @swagger
 * /exam/admin/list:
 *   get:
 *     summary: List all exams for admin with pagination and status filter
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [published, draft]
 *     responses:
 *       200:
 *         description: List of exams
 */
router.get(
  "/admin/list",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  ExamController.listAdminExams
);

/**
 * @swagger
 * /exam/admin/filter:
 *   post:
 *     summary: List all exams for admin with filtering via body
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of exams
 */
router.post(
  "/admin/filter",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  ExamController.listAdminExams
);

/**
 * @swagger
 * /exam:
 *   post:
 *     summary: Create or update an exam
 *     tags: [Exams]
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
 *               - title
 *               - level_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: SAT Exam
 *               description:
 *                 type: string
 *               level_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [published, draft]
 *               examDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Exam created/updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(createOrUpdateExamSchema, "body"),
  ExamController.createOrUpdateExam
);

/**
 * @swagger
 * /exam/{slug}:
 *   get:
 *     summary: Get exam by slug
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam details
 *       404:
 *         description: Exam not found
 */
router.get(
  "/:slug",
  requestValidator(examSlugParamSchema, "params"),
  ExamController.getExam
);

/**
 * @swagger
 * /exam/{id}:
 *   delete:
 *     summary: Delete an exam
 *     tags: [Exams]
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
 *         description: Exam deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Exam not found
 */
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(examIdParamSchema, "params"),
  ExamController.deleteExam
);

export default router;
