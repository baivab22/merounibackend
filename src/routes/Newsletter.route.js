import express from "express";

import NewsletterController from "../controllers/newsletter/Newsletter.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", NewsletterController.listNewsletter)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
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
