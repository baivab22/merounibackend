import express from "express";

import UniversityController from "../controllers/university/University.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", UniversityController.listUniversities)
  .get("/:slug", UniversityController.getUniversityProfile)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    UniversityController.createOrUpdateUniversity
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    UniversityController.deleteUniversity
  );

export default route;
