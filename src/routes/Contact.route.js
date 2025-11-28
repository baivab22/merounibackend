import express from "express";

import ContactController from "../controllers/contact/Contact.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", ContactController.listContacts)
  .get("/:slugs", ContactController.getContact)
  .post("/", ContactController.addContact)
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    ContactController.deleteContact
  );

export default route;
