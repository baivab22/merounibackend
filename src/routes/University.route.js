import express from "express";

import UniversityController from "../controllers/university/University.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  universitySlugParamSchema,
  createOrUpdateUniversitySchema,
  deleteUniversityQuerySchema,
} from "../validators/university/University.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    UniversityController.listUniversities
  )
  .get(
    "/:slug",
    requestValidator(universitySlugParamSchema, "params"),
    UniversityController.getUniversityProfile
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidator(createOrUpdateUniversitySchema, "body"),
    UniversityController.createOrUpdateUniversity
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidator(deleteUniversityQuerySchema, "query"),
    UniversityController.deleteUniversity
  );

export default route;
