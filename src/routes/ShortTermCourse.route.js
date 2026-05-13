import express from "express";
import ShortTermCourseController from "../controllers/short-term-course/ShortTermCourse.controller.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
    createShortTermCourseSchema,
    updateShortTermCourseSchema
} from "../validators/short-term-course/ShortTermCourse.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ShortTermCourses
 *   description: Short Term Course management
 */

/**
 * @swagger
 * /short-term-courses:
 *   get:
 *     summary: List all short term courses
 *     tags: [ShortTermCourses]
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
 *         description: List of short term courses
 *       500:
 *         description: Server error
 */
router.get("/", ShortTermCourseController.listCourses);

/**
 * @swagger
 * /short-term-courses/{id}:
 *   get:
 *     summary: Get a short term course by ID
 *     tags: [ShortTermCourses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Short term course details
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get("/:id", ShortTermCourseController.getCourseById);

/**
 * @swagger
 * /short-term-courses/slug/{slug}:
 *   get:
 *     summary: Get a short term course by slug
 *     tags: [ShortTermCourses]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Short term course details
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get("/slug/:slug", ShortTermCourseController.getCourseBySlug);

/**
 * @swagger
 * /short-term-courses:
 *   post:
 *     summary: Create a short term course
 *     tags: [ShortTermCourses]
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
    requestValidator(createShortTermCourseSchema, "body"),
    ShortTermCourseController.createCourse
);

/**
 * @swagger
 * /short-term-courses/{id}:
 *   put:
 *     summary: Update a short term course
 *     tags: [ShortTermCourses]
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
    requestValidator(updateShortTermCourseSchema, "body"),
    ShortTermCourseController.updateCourse
);

/**
 * @swagger
 * /short-term-courses/{id}:
 *   delete:
 *     summary: Delete a short term course
 *     tags: [ShortTermCourses]
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
router.delete("/:id", ShortTermCourseController.deleteCourse);

export default router;
