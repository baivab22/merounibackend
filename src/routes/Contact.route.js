import express from "express";

import ContactController from "../controllers/contact/Contact.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  createContactSchema,
  contactEmailQuerySchema,
  idQuerySchema,
  listContactSchema,
} from "../validators/contact/Contact.validator.js";

const route = express.Router();

/**
 * @swagger
 * /contact-us:
 *   get:
 *     summary: List all contact submissions
 *     tags: [Contact]
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
 *         description: Search by name, email, subject, or message
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, in_progress, resolved]
 *     responses:
 *       200:
 *         description: List of contact submissions
 */
route.get(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(listContactSchema, "query"),
  ContactController.listContacts
);

/**
 * @swagger
 * /contact-us/{slug}:
 *   get:
 *     summary: Get contact submission by email
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Contact submission details
 *       404:
 *         description: Not found
 */
route.get(
  "/:slug",
  requestValidator(contactEmailQuerySchema, "query"),
  ContactController.getContact
);

/**
 * @swagger
 * /contact-us:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - phone
 *               - subject
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: 9841234567
 *               subject:
 *                 type: string
 *                 example: Admission Inquiry
 *               message:
 *                 type: string
 *                 example: I have a question about...
 *     responses:
 *       201:
 *         description: Contact submission created successfully
 *       400:
 *         description: Bad request
 */
route.post(
  "/",
  requestValidator(createContactSchema, "body"),
  ContactController.addContact
);

/**
 * @swagger
 * /contact-us/update-status:
 *   patch:
 *     summary: Update contact status (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
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
 *                 enum: [new, in_progress, resolved]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
import { updateContactStatusSchema } from "../validators/contact/Contact.validator.js";

route.patch(
  "/update-status",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(idQuerySchema, "query"),
  requestValidator(updateContactStatusSchema, "body"),
  ContactController.updateStatus
);

/**
 * @swagger
 * /contact-us:
 *   delete:
 *     summary: Delete a contact submission (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact submission deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(idQuerySchema, "query"),
  ContactController.deleteContact
);

export default route;
