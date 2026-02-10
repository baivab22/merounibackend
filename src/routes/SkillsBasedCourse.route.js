import express from "express";
import SkillsBasedCourseController from "../controllers/skills-based-course/SkillsBasedCourse.controller.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
    createSkillsBasedCourseSchema,
    updateSkillsBasedCourseSchema
} from "../validators/skills-based-course/SkillsBasedCourse.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SkillsBasedCourses
 *   description: Skills Based Course management
 */

/**
 * @swagger
 * /skills-based-courses:
 *   get:
 *     summary: List all skills based courses
 *     tags: [SkillsBasedCourses]
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
 *         description: List of skills based courses
 *       500:
 *         description: Server error
 */
router.get("/", SkillsBasedCourseController.listCourses);

/**
 * @swagger
 * /skills-based-courses/{id}:
 *   get:
 *     summary: Get a skills based course by ID
 *     tags: [SkillsBasedCourses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skills based course details
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get("/:id", SkillsBasedCourseController.getCourseById);

/**
 * @swagger
 * /skills-based-courses/slug/{slugs}:
 *   get:
 *     summary: Get a skills based course by slug
 *     tags: [SkillsBasedCourses]
 *     parameters:
 *       - in: path
 *         name: slugs
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skills based course details
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get("/slug/:slug",     SkillsBasedCourseController.getCourseBySlug);

/**
 * @swagger
 * /skills-based-courses:
 *   post:
 *     summary: Create a skills based course
 *     tags: [SkillsBasedCourses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail_image:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               is_featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Course created
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    requestValidator(createSkillsBasedCourseSchema, "body"),
    SkillsBasedCourseController.createCourse
);

/**
 * @swagger
 * /skills-based-courses/{id}:
 *   put:
 *     summary: Update a skills based course
 *     tags: [SkillsBasedCourses]
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
 *               description:
 *                 type: string
 *               thumbnail_image:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               is_featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course updated
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    requestValidator(updateSkillsBasedCourseSchema, "body"),
    SkillsBasedCourseController.updateCourse
);

/**
 * @swagger
 * /skills-based-courses/{id}:
 *   delete:
 *     summary: Delete a skills based course
 *     tags: [SkillsBasedCourses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", SkillsBasedCourseController.deleteCourse);

export default router;
