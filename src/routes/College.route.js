import express from "express";

import CollegeController from "../controllers/college/College.controller.js";
import {
  authenticateUser,
  optionalAuthenticateUser,
} from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  admissionPaginationSchema,
  collegeIdParamSchema,
  collegePaginationSchema,
  collegeSlugParamSchema,
  createOrUpdateAdmissionSchema,
  createOrUpdateCollegeSchema,
  updateCollegeOrderSchema,
  updateAdmissionOrderSchema,
} from "../validators/college/College.validator.js";

const router = express.Router();

/**
 * @swagger
 * /college:
 *   post:
 *     summary: Create or update a college
 *     tags: [Colleges]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               featured_img:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: College created/updated successfully
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
  authorizeRole(["admin", "editor", "agent"]),
  requestValidator(createOrUpdateCollegeSchema, "body"),
  CollegeController.createOrUpdateCollege,
);

/**
 * @swagger
 * /college/save-as-draft:
 *   post:
 *     summary: Save a college as draft
 *     tags: [Colleges]
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
 *               - name
 *     responses:
 *       200:
 *         description: College saved as draft
 */
router.post(
  "/save-as-draft",
  authenticateUser,
  authorizeRole(["admin", "editor", "agent"]),
  requestValidator(createOrUpdateCollegeSchema, "body"),
  CollegeController.saveAsDraft,
);

/**
 * @swagger
 * /college/admission:
 *   get:
 *     summary: List college admissions
 *     tags: [Colleges]
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
 *     responses:
 *       200:
 *         description: List of admissions
 */
router.get(
  "/admission",
  requestValidator(admissionPaginationSchema, "query"),
  CollegeController.listAdmissions,
);

/**
 * @swagger
 * /college/admission/{id}:
 *   get:
 *     summary: Get admission detail by id
 *     tags: [Colleges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admission details
 *       404:
 *         description: Admission detail not found
 */
router.get("/admission/:id", CollegeController.getAdmissionById);

/**
 * @swagger
 * /college/admission:
 *   post:
 *     summary: Create or update an admission
 *     tags: [Colleges]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admission'
 *     responses:
 *       200:
 *         description: Admission created/updated successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/admission",
  authenticateUser,
  authorizeRole(["admin", "editor", "agent"]),
  requestValidator(createOrUpdateAdmissionSchema, "body"),
  CollegeController.createOrUpdateAdmission,
);

/**
 * @swagger
 * /college/admission/update-order:
 *   patch:
 *     summary: Update admission display order
 *     tags: [Colleges]
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
 *               - admissions
 *             properties:
 *               admissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     order_no:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/admission/update-order",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(updateAdmissionOrderSchema, "body"),
  CollegeController.updateAdmissionOrder,
);

/**
 * @swagger
 * /college/admission/{id}:
 *   delete:
 *     summary: Delete an admission
 *     tags: [Colleges]
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
 *         description: Admission deleted successfully
 */
router.delete(
  "/admission/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  CollegeController.deleteAdmission,
);

/**
 * @swagger
 * /college:
 *   get:
 *     summary: List all colleges with pagination
 *     tags: [Colleges]
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
 *         name: pinned
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of colleges
 */
router.get(
  "/",
  optionalAuthenticateUser,
  requestValidator(collegePaginationSchema, "query"),
  CollegeController.listColleges,
);

/**
 * @swagger
 * /college/filter:
 *   post:
 *     summary: List all colleges with filtering via body
 *     tags: [Colleges]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: List of colleges
 */
router.post(
  "/filter",
  optionalAuthenticateUser,
  requestValidator(collegePaginationSchema, "body"),
  CollegeController.listColleges,
);

/**
 * @swagger
 * /college/featured:
 *   get:
 *     summary: List featured colleges (with name, slug, and programs)
 *     tags: [Colleges]
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
 *           default: 24
 *     responses:
 *       200:
 *         description: List of featured colleges
 *       500:
 *         description: Server error
 */
router.get(
  "/featured",
  requestValidator(collegePaginationSchema, "query"),
  CollegeController.getFeaturedColleges,
);

/**
 * @swagger
 * /college/{slug}:
 *   get:
 *     summary: Get college by slug
 *     tags: [Colleges]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: College details
 *       404:
 *         description: College not found
 */
router.get(
  "/:slug",
  requestValidator(collegeSlugParamSchema, "params"),
  CollegeController.getCollegeBySlug,
);

/**
 * @swagger
 * /college/{id}/programs:
 *   get:
 *     summary: List all programs associated with a college
 *     tags: [Colleges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of programs
 *       404:
 *         description: College not found
 */
router.get(
  "/:id/programs",
  requestValidator(collegeIdParamSchema, "params"),
  CollegeController.listProgramsByCollegeId,
);

/**
 * @swagger
 * /college/{id}:
 *   delete:
 *     summary: Delete a college
 *     tags: [Colleges]
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
 *         description: College deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: College not found
 */
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(collegeIdParamSchema, "params"),
  CollegeController.deleteCollege,
);

/**
 * @swagger
 * /college/{id}/referable:
 *   patch:
 *     summary: Update college referable status
 *     tags: [Colleges]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
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
 *             required:
 *               - is_referable
 *             properties:
 *               is_referable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Referable status updated successfully
 *       404:
 *         description: College not found
 */
router.patch(
  "/:id/referable",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(collegeIdParamSchema, "params"),
  CollegeController.updateReferableStatus,
);

/**
 * @swagger
 * /college/institution/my-college:
 *   get:
 *     summary: Get college by institution user (Institution only)
 *     tags: [Colleges]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: College details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: College not found
 */
router.get(
  "/institution/my-college",
  authenticateUser,
  authorizeRole(["institution"]),
  CollegeController.getCollegeByInstitutionUser,
);

/**
 * @swagger
 * /college/institution/my-college:
 *   put:
 *     summary: Update college by institution user (Institution only)
 *     tags: [Colleges]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: College updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  "/institution/my-college",
  authenticateUser,
  authorizeRole(["institution"]),
  requestValidator(createOrUpdateCollegeSchema, "body"),
  CollegeController.updateCollegeByInstitutionUser,
);

/**
 * @swagger
 * /college/order:
 *   put:
 *     summary: Update college display order
 *     tags: [Colleges]
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
 *               - order_no_for_website
 *             properties:
 *               college_id:
 *                 type: integer
 *               order_no_for_website:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  "/order",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(updateCollegeOrderSchema, "body"),
  CollegeController.updateCollegeOrder,
);

export default router;
