import express from "express";

import FacultyController from "../controllers/faculty/Faculty.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  facultySlugParamSchema,
  createFacultySchema,
  updateFacultyQuerySchema,
  updateFacultyBodySchema,
  deleteFacultyQuerySchema,
} from "../validators/faculty/Faculty.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    FacultyController.listFaculty
  )
  .get(
    "/:slugs",
    requestValidator(facultySlugParamSchema, "params"),
    FacultyController.getFaculty
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidator(createFacultySchema, "body"),
    FacultyController.createFaculty
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    requestValidator(deleteFacultyQuerySchema, "query"),
    FacultyController.deleteFaculty
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateFacultyQuerySchema, property: "query" },
      { schema: updateFacultyBodySchema, property: "body" },
    ]),
    FacultyController.updateFaculty
  );

export default route;
