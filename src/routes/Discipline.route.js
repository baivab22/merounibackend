import express from "express";
import DisciplineController from "../controllers/discipline/Discipline.controller.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
    createDisciplineSchema,
    updateDisciplineSchema,
    updateDisciplineOrderSchema,
} from "../validators/discipline/Discipline.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Discipline
 *   description: Discipline management
 */

/**
 * @swagger
 * /discipline:
 *   get:
 *     summary: List all disciplines
 *     tags: [Discipline]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of disciplines
 *       500:
 *         description: Server error
 */
router.get("/", DisciplineController.listDisciplines);

/**
 * @swagger
 * /discipline/{id}:
 *   get:
 *     summary: Get a discipline by ID
 *     tags: [Discipline]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Discipline details
 *       404:
 *         description: Discipline not found
 *       500:
 *         description: Server error
 */
router.get("/:id", DisciplineController.getDisciplineById);

/**
 * @swagger
 * /discipline/slug/{slugs}:
 *   get:
 *     summary: Get a discipline by slug
 *     tags: [Discipline]
 *     parameters:
 *       - in: path
 *         name: slugs
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discipline details
 *       404:
 *         description: Discipline not found
 *       500:
 *         description: Server error
 */
router.get("/slug/:slugs", DisciplineController.getDisciplineBySlug);

router.patch(
    "/update-order",
    requestValidator(updateDisciplineOrderSchema, "body"),
    DisciplineController.updateDisciplineOrder
);

/**
 * @swagger
 * /discipline:
 *   post:
 *     summary: Create a discipline
 *     tags: [Discipline]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               featured_image:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Discipline created
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    requestValidator(createDisciplineSchema, "body"),
    DisciplineController.createDiscipline
);

/**
 * @swagger
 * /discipline/{id}:
 *   put:
 *     summary: Update a discipline
 *     tags: [Discipline]
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
 *             properties:
 *               title:
 *                 type: string
 *               featured_image:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Discipline updated
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    requestValidator(updateDisciplineSchema, "body"),
    DisciplineController.updateDiscipline
);

/**
 * @swagger
 * /discipline:
 *   delete:
 *     summary: Delete a discipline
 *     tags: [Discipline]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Discipline deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", DisciplineController.deleteDiscipline);

export default router;
