import express from "express";

import CourseController from "../controllers/course/Course.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  courseSlugParamSchema,
  createOrUpdateCourseSchema,
  deleteCourseQuerySchema,
} from "../validators/course/Course.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    CourseController.listCourses
  )
  .get(
    "/:slugs",
    requestValidator(courseSlugParamSchema, "params"),
    CourseController.getCourse
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(createOrUpdateCourseSchema, "body"),
    CourseController.createOrUpdateCourse
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(deleteCourseQuerySchema, "query"),
    CourseController.deleteCourse
  );

export default route;
