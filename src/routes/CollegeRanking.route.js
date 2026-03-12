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
  deleteDegreeRankingsQuerySchema,
  getRankingsByDegreeQuerySchema,
  updateDegreeDescriptionSchema,
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
 * /college-ranking/degree:
 *   get:
 *     summary: Get rankings by degree
 *     tags: [College Rankings]
 *     parameters:
 *       - in: query
 *         name: degree_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category_title
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rankings for the specified degree
 */
route.get(
  "/degree",
  requestValidator(getRankingsByDegreeQuerySchema, "query"),
  CollegeRankingController.getRankingsByDegree
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
 *               - degree_id
 *             properties:
 *               college_id:
 *                 type: integer
 *               degree_id:
 *                 type: integer
 *               category_title:
 *                 type: string
 *               degree_list_order:
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
  authorizeRole(["admin","editor"]),
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
  authorizeRole(["admin", "editor"]),
  requestValidator(updateRankingOrderSchema, "body"),
  CollegeRankingController.updateRankingOrder
);

/**
 * @swagger
 * /college-ranking/degree-order:
 *   put:
 *     summary: Update degree order in rankings (Admin only)
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
 *               degreeOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     degree_id:
 *                       type: integer
 *                     degree_list_order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Degree order updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.put(
  "/degree-order",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  CollegeRankingController.updateDegreeOrder
);

/**
 * @swagger
 * /college-ranking/degree-description:
 *   put:
 *     summary: Update description for a degree category (Admin only)
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
 *               degree_id:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Degree description updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.put(
  "/degree-description",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(updateDegreeDescriptionSchema, "body"),
  CollegeRankingController.updateDegreeDescription
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
  authorizeRole(["admin","editor"]),
  requestValidator(deleteRankingQuerySchema, "query"),
  CollegeRankingController.deleteRanking
);

/**
 * @swagger
 * /college-ranking/degree:
 *   delete:
 *     summary: Delete all rankings for a degree (Admin only)
 *     tags: [College Rankings]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: degree_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Degree rankings deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.delete(
  "/degree",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(deleteDegreeRankingsQuerySchema, "query"),
  CollegeRankingController.deleteDegreeRankings
);

export default route;
