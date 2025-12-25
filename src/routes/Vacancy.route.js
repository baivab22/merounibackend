import express from "express";

import VacancyController from "../controllers/vacancy/Vacancy.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  slugParamSchema,
  createVacancySchema,
  updateVacancyQuerySchema,
  updateVacancyBodySchema,
  deleteVacancyQuerySchema,
} from "../validators/vacancy/Vacancy.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    VacancyController.listVacancies
  )
  .get(
    "/:slugs",
    requestValidator(slugParamSchema, "params"),
    VacancyController.getVacancyBySlug
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidator(createVacancySchema, "body"),
    VacancyController.createVacancy
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    requestValidator(deleteVacancyQuerySchema, "query"),
    VacancyController.deleteVacancy
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateVacancyQuerySchema, property: "query" },
      { schema: updateVacancyBodySchema, property: "body" },
    ]),
    VacancyController.updateVacancy
  );

export default route;
