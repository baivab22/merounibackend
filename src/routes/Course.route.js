import express from "express";

import CourseController from "../controllers/course/Course.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  courseSlugParamSchema,
  createOrUpdateCourseSchema,
  deleteCourseQuerySchema,
} from "../validators/course/Course.validator.js";

const route = express.Router();

/**
 * @swagger
 * /course:
 *   get:
 *     summary: List all courses with pagination
 *     tags: [Courses]
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
 *         name: credits
 *         schema:
 *           type: string
 *         description: Filter by credits (e.g., "3-6")
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: Filter by duration (e.g., "2-4")
 *       - in: query
 *         name: faculty
 *         schema:
 *           type: integer
 *         description: Filter by faculty ID
 *     responses:
 *       200:
 *         description: List of courses
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  CourseController.listCourses
);

/**
 * @swagger
 * /course/{slug}:
 *   get:
 *     summary: Get course by slug
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
route.get(
  "/:slug",
  requestValidator(courseSlugParamSchema, "params"),
  CourseController.getCourse
);

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Create or update a course
 *     tags: [Courses]
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
 *               - faculty_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Computer Science
 *               description:
 *                 type: string
 *               faculty_id:
 *                 type: integer
 *               credits:
 *                 type: integer
 *               duration:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Course created/updated successfully
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
  authorizeRole(["admin", "editor"]),
  requestValidator(createOrUpdateCourseSchema, "body"),
  CourseController.createOrUpdateCourse
);

/**
 * @swagger
 * /course:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: course_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(deleteCourseQuerySchema, "query"),
  CourseController.deleteCourse
);

export default route;
