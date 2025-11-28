import express from "express";

import FacultyController from "../controllers/faculty/Faculty.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", FacultyController.listFaculty)
  .get("/:slugs", FacultyController.getFaculty)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    FacultyController.createFaculty
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    FacultyController.deleteFaculty
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    FacultyController.updateFaculty
  );

export default route;
