import express from "express";

import CareerController from "../controllers/career/Career.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  slugParamSchema,
  createCareerSchema,
  updateCareerQuerySchema,
  updateCareerBodySchema,
  deleteCareerQuerySchema,
} from "../validators/career/Career.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    CareerController.listCareers
  )
  .get(
    "/:slugs",
    requestValidator(slugParamSchema, "params"),
    CareerController.getCareerBySlug
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidator(createCareerSchema, "body"),
    CareerController.createCareer
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    requestValidator(deleteCareerQuerySchema, "query"),
    CareerController.deleteCareer
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateCareerQuerySchema, property: "query" },
      { schema: updateCareerBodySchema, property: "body" },
    ]),
    CareerController.updateCareer
  );

export default route;
