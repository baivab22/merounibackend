import express from "express";

import CourseController from "../controllers/course/Course.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", CourseController.listCourses)
  .get("/:slugs", CourseController.getCourse)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    CourseController.createOrUpdateCourse
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    CourseController.deleteCourse
  );

export default route;
