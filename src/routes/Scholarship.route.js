import express from "express";

import ScholarshipController from "../controllers/scholarship/Scholarship.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", ScholarshipController.listScholarships)
  .get("/:id", ScholarshipController.getScholarship)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    ScholarshipController.createScholarship
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    ScholarshipController.deleteScholarship
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    ScholarshipController.updateScholarship
  );

export default route;
