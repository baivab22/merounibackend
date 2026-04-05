import express from "express";

import SchoolController from "../controllers/school/School.controller.js";
import { authenticateUser, optionalAuthenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
    schoolPaginationSchema,
    collegeSlugParamSchema,
    updateSchoolOrderSchema,
} from "../validators/college/College.validator.js";

const router = express.Router();

/**
 * @swagger
 * /school:
 *   get:
 *     summary: List schools
 *     tags: [Schools]
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
 *         name: is_featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: pinned
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of schools
 */
router.get(
    "/",
    optionalAuthenticateUser,
    requestValidator(schoolPaginationSchema, "query"),
    SchoolController.listSchools
);

/**
 * @swagger
 * /school/{slugs}:
 *   get:
 *     summary: Get school by slug
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: slugs
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: School details
 *       404:
 *         description: School not found
 */
/**
 * @swagger
 * /school/universities:
 *   get:
 *     summary: List unique universities associated with schools
 *     tags: [Schools]
 *     responses:
 *       200:
 *         description: List of unique universities
 */
router.get("/affiliations", SchoolController.listSchoolAffiliations);
router.get("/boards", SchoolController.listSchoolBoards);
router.get("/streams", SchoolController.listSchoolStreams);


router.get(
    "/:slugs",
    requestValidator(collegeSlugParamSchema, "params"),
    SchoolController.getSchoolBySlug
);

router.patch(
    "/update-order",
    requestValidator(updateSchoolOrderSchema, "body"),
    SchoolController.updateSchoolOrder
);

export default router;
