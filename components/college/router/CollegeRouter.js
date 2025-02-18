import express from "express";
import {
  getColleges,
  getCollegeById,
} from "../controller/CollegeController.js";

import { listSchoolController } from "../controller/GetSchoolController.js";

import { listAdmission } from "../controller/GetAdmission.js";

import { createOrUpdateCollege } from "../controller/RegisterCollege.js";
import { deleteCollege } from "../controller/DeleteCollege.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const router = express.Router();

router
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor", "agent"]),
    createOrUpdateCollege
  )
  .get("/admission", listAdmission)
  .get("/list-school", listSchoolController)
  .get("/", getColleges)
  .get("/:slugs", getCollegeById)
  .delete(
    "/:id",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteCollege
  );

export default router;
