import express from "express";

// user controller
import { getAllCourses, getCourse } from "../controllers/ListCourse.js";
import { createCourse } from "../controllers/NewCourse.js";
import { deleteCourses } from "../controllers/DeleteCourse.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", getAllCourses)
  .get("/:slugs", getCourse)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    createCourse
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    deleteCourses
  );

export default route;
