import express from "express";

// user controller
import {
  getAllScholarships,
  getScholarshipById,
} from "../controllers/GetAllItems.js";
import { createScholarship } from "../controllers/AddScholarship.js";
import { deleteScholarship } from "../controllers/DeleteScholarship.js";
import { updateScholarship } from "../controllers/UpdateScholarship.js";

const route = express.Router();

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

route
  .get("/", getAllScholarships)
  .get("/", getScholarshipById)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    createScholarship
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    deleteScholarship
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    updateScholarship
  );

export default route;
