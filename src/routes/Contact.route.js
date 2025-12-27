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

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    ContactController.listContacts
  )
  .get(
    "/:slugs",
    requestValidator(contactEmailQuerySchema, "query"),
    ContactController.getContact
  )
  .post(
    "/",
    requestValidator(createContactSchema, "body"),
    ContactController.addContact
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(idQuerySchema, "query"),
    ContactController.deleteContact
  );

export default route;
