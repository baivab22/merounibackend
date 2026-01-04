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
 *     responses:
 *       200:
 *         description: List of contact submissions
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  ContactController.listContacts
);

/**
 * @swagger
 * /contact-us/{slugs}:
 *   get:
 *     summary: Get contact submission by email
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: slugs
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
  "/:slugs",
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
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               message:
 *                 type: string
 *                 example: I have a question about...
 *               phone:
 *                 type: string
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
