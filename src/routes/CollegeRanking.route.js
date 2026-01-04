import express from "express";
import CollegeRankingController from "../controllers/college/CollegeRanking.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  createCollegeRankingSchema,
  updateRankingOrderSchema,
  deleteRankingQuerySchema,
  deleteProgramRankingsQuerySchema,
  getRankingsByProgramQuerySchema,
} from "../validators/college/CollegeRanking.validator.js";

const route = express.Router();

/**
 * @swagger
 * /college-ranking:
 *   get:
 *     summary: List all college rankings with pagination
 *     tags: [College Rankings]
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
 *         name: category_title
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of college rankings
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  CollegeRankingController.listRankings
);

/**
 * @swagger
 * /college-ranking/program:
 *   get:
 *     summary: Get rankings by program
 *     tags: [College Rankings]
 *     parameters:
 *       - in: query
 *         name: program_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category_title
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rankings for the specified program
 */
route.get(
  "/program",
  requestValidator(getRankingsByProgramQuerySchema, "query"),
  CollegeRankingController.getRankingsByProgram
);

/**
 * @swagger
 * /college-ranking:
 *   post:
 *     summary: Create a new college ranking (Admin only)
 *     tags: [College Rankings]
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
 *               - program_id
 *             properties:
 *               college_id:
 *                 type: integer
 *               program_id:
 *                 type: integer
 *               category_title:
 *                 type: string
 *               program_list_order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Ranking created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.post(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(createCollegeRankingSchema, "body"),
  CollegeRankingController.createRanking
);

/**
 * @swagger
 * /college-ranking/order:
 *   put:
 *     summary: Update ranking order (Admin only)
 *     tags: [College Rankings]
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
 *               - ranking_id
 *               - order
 *             properties:
 *               ranking_id:
 *                 type: integer
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.put(
  "/order",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(updateRankingOrderSchema, "body"),
  CollegeRankingController.updateRankingOrder
);

/**
 * @swagger
 * /college-ranking/program-order:
 *   put:
 *     summary: Update program order in rankings (Admin only)
 *     tags: [College Rankings]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rankings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ranking_id:
 *                       type: integer
 *                     program_list_order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Program order updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.put(
  "/program-order",
  authenticateUser,
  authorizeRole(["admin"]),
  CollegeRankingController.updateProgramOrder
);

/**
 * @swagger
 * /college-ranking:
 *   delete:
 *     summary: Delete a college ranking (Admin only)
 *     tags: [College Rankings]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: ranking_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ranking deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ranking not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteRankingQuerySchema, "query"),
  CollegeRankingController.deleteRanking
);

/**
 * @swagger
 * /college-ranking/program:
 *   delete:
 *     summary: Delete all rankings for a program (Admin only)
 *     tags: [College Rankings]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: program_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Program rankings deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.delete(
  "/program",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteProgramRankingsQuerySchema, "query"),
  CollegeRankingController.deleteProgramRankings
);

export default route;
