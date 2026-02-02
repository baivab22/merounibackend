import express from "express";
import VideoController from "../controllers/video/Video.controller.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
    createVideoSchema,
    updateVideoSchema,
} from "../validators/video/Video.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Video
 *   description: Video management
 */

/**
 * @swagger
 * /video:
 *   get:
 *     summary: List all videos
 *     tags: [Video]
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
 *         description: List of videos
 *       500:
 *         description: Server error
 */
router.get("/", VideoController.listVideos);

/**
 * @swagger
 * /video/{id}:
 *   get:
 *     summary: Get a video by ID
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video details
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.get("/:id", VideoController.getVideoById);

/**
 * @swagger
 * /video/slug/{slug}:
 *   get:
 *     summary: Get a video by Slug
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video details
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.get("/slug/:slug", VideoController.getVideoBySlug);

/**
 * @swagger
 * /video:
 *   post:
 *     summary: Create a video
 *     tags: [Video]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               yt_video_link:
 *                 type: string
 *               featured_image:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video created
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    requestValidator(createVideoSchema, "body"),
    VideoController.createVideo
);

/**
 * @swagger
 * /video/{id}:
 *   put:
 *     summary: Update a video
 *     tags: [Video]
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
 *               yt_video_link:
 *                 type: string
 *               featured_image:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video updated
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    requestValidator(updateVideoSchema, "body"),
    VideoController.updateVideo
);

/**
 * @swagger
 * /video:
 *   delete:
 *     summary: Delete a video
 *     tags: [Video]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", VideoController.deleteVideo);

export default router;
