import express from "express";

import ScholarshipController from "../controllers/scholarship/Scholarship.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  scholarshipIdParamSchema,
  createScholarshipSchema,
  updateScholarshipQuerySchema,
  updateScholarshipBodySchema,
  deleteScholarshipQuerySchema,
} from "../validators/scholarship/Scholarship.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    ScholarshipController.listScholarships
  )
  .get(
    "/:id",
    requestValidator(scholarshipIdParamSchema, "params"),
    ScholarshipController.getScholarship
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(createScholarshipSchema, "body"),
    ScholarshipController.createScholarship
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(deleteScholarshipQuerySchema, "query"),
    ScholarshipController.deleteScholarship
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateScholarshipQuerySchema, property: "query" },
      { schema: updateScholarshipBodySchema, property: "body" },
    ]),
    ScholarshipController.updateScholarship
  );

export default route;
