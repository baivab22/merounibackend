import express from "express";

import NewsletterController from "../controllers/newsletter/Newsletter.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  createNewsletterSchema,
} from "../validators/newsletter/Newsletter.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    NewsletterController.listNewsletter
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidator(createNewsletterSchema, "body"),
    NewsletterController.createNewsletter
  );
//   .delete(
//     "/",
//     authenticateUser,
//     authorizeRole(["super-admin", "admin"]),
//     deleteMaterial
//   )
//   .put(
//     "/",
//     authenticateUser,
//     authorizeRole(["super-admin", "admin", "editor"]),
//     updateMaterial
//   );

export default route;
