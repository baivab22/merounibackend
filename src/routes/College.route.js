import express from "express";

import CollegeController from "../controllers/college/College.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const router = express.Router();

router
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor", "agent"]),
    CollegeController.createOrUpdateCollege
  )
  .get("/admission", CollegeController.listAdmissions)
  .get("/list-school", CollegeController.listSchools)
  .get("/", CollegeController.listColleges)
  .get("/:slugs", CollegeController.getCollegeBySlug)
  .delete(
    "/:id",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    CollegeController.deleteCollege
  );

export default router;
