import express from "express";
import StudentMembershipController from "../controllers/student-membership/StudentMembership.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  applyForMembershipSchema,
  guestApplyForMembershipSchema,
  updateMembershipSchema,
  updateMembershipStatusSchema,
  idParamSchema,
} from "../validators/student-membership/StudentMembership.validator.js";

const route = express.Router();

/**
 * @swagger
 * /student-member/apply:
 *   post:
 *     summary: Apply for a membership (logged-in student only)
 *     tags: [Student Memberships]
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
 *               - membership_type
 *             properties:
 *               membership_type:
 *                 type: string
 *                 enum: [PLUS2, BACHELORS, GRADUATE]
 *               career_field:
 *                 type: string
 *                 enum: [it, hospitality, business, unsure]
 *                 nullable: true
 *               selected_trainings:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required (min 1) when career_field is a real field
 *               institution:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               membership_fee:
 *                 type: string
 *               payment_proof_url:
 *                 type: string
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: >-
 *           Membership application submitted successfully. The returned membership
 *           includes a server-generated reference_id (e.g. MU-26-7F3K9QX2) which the
 *           member quotes in their offline payment so an admin can verify it.
 *       400:
 *         description: Bad request (duplicate application or invalid type)
 *       403:
 *         description: Forbidden (student role required)
 *       404:
 *         description: Student not found
 */
route.post(
  "/apply",
  authenticateUser,
  requestValidator(applyForMembershipSchema, "body"),
  StudentMembershipController.applyForMembership
);

/**
 * @swagger
 * /student-member/guest-apply:
 *   post:
 *     summary: Apply for a membership (guest, no login required)
 *     tags: [Student Memberships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_name
 *               - student_email
 *               - student_phone_no
 *               - membership_type
 *             properties:
 *               student_name:
 *                 type: string
 *               student_email:
 *                 type: string
 *               student_phone_no:
 *                 type: string
 *               membership_type:
 *                 type: string
 *                 enum: [PLUS2, BACHELORS, GRADUATE]
 *               career_field:
 *                 type: string
 *                 enum: [it, hospitality, business, unsure]
 *                 nullable: true
 *               selected_trainings:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required (min 1) when career_field is a real field
 *               institution:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               membership_fee:
 *                 type: string
 *               payment_proof_url:
 *                 type: string
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: >-
 *           Membership application submitted successfully. The returned membership
 *           includes a server-generated reference_id (e.g. MU-26-7F3K9QX2) which the
 *           member quotes in their offline payment so an admin can verify it.
 *       400:
 *         description: Bad request (invalid data)
 */
route.post(
  "/guest-apply",
  requestValidator(guestApplyForMembershipSchema, "body"),
  StudentMembershipController.applyForMembershipAsGuest
);

/**
 * @swagger
 * /student-member/my-memberships:
 *   get:
 *     summary: Get the current user's membership applications
 *     tags: [Student Memberships]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, EXPIRED]
 *     responses:
 *       200:
 *         description: List of memberships
 */
route.get(
  "/my-memberships",
  authenticateUser,
  requestValidator(paginationSchema, "query"),
  StudentMembershipController.getStudentMemberships
);

/**
 * @swagger
 * /student-member:
 *   get:
 *     summary: Get all membership applications (admin only)
 *     tags: [Student Memberships]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, EXPIRED]
 *       - in: query
 *         name: membershipType
 *         schema:
 *           type: string
 *           enum: [PLUS2, BACHELORS, GRADUATE]
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: >-
 *           Free-text search across student name, email, phone and payment reference.
 *           Admins use this to look up the reference the member quoted in their
 *           payment; the "MU-" prefix and dashes are optional in the search term.
 *     responses:
 *       200:
 *         description: List of all memberships
 */
route.get(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(paginationSchema, "query"),
  StudentMembershipController.getAllMemberships
);

/**
 * @swagger
 * /student-member/{id}:
 *   get:
 *     summary: Get a membership by id (admin only)
 *     tags: [Student Memberships]
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
 *         description: Membership details
 *       404:
 *         description: Membership not found
 */
route.get(
  "/:id",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(idParamSchema, "params"),
  StudentMembershipController.getMembershipById
);

/**
 * @swagger
 * /student-member/{id}:
 *   put:
 *     summary: Update a membership (admin only)
 *     tags: [Student Memberships]
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
 *             properties:
 *               membership_type:
 *                 type: string
 *                 enum: [PLUS2, BACHELORS, GRADUATE]
 *               payment_proof_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membership updated successfully
 *       404:
 *         description: Membership not found
 */
route.put(
  "/:id",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(idParamSchema, "params"),
  requestValidator(updateMembershipSchema, "body"),
  StudentMembershipController.updateMembership
);

/**
 * @swagger
 * /student-member/{id}/status:
 *   patch:
 *     summary: Update membership status (admin only)
 *     tags: [Student Memberships]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED, EXPIRED]
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membership status updated
 *       404:
 *         description: Membership not found
 */
route.patch(
  "/:id/status",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(idParamSchema, "params"),
  requestValidator(updateMembershipStatusSchema, "body"),
  StudentMembershipController.updateMembershipStatus
);

/**
 * @swagger
 * /student-member/{id}:
 *   delete:
 *     summary: Delete a membership (admin only)
 *     tags: [Student Memberships]
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
 *         description: Membership deleted successfully
 *       404:
 *         description: Membership not found
 */
route.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(idParamSchema, "params"),
  StudentMembershipController.deleteMembership
);

export default route;