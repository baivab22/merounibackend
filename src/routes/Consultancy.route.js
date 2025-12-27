import express from "express";

import ConsultancyController from "../controllers/consultancy/Consultancy.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  consultancySlugParamSchema,
  createOrUpdateConsultancySchema,
  deleteConsultancyQuerySchema,
} from "../validators/consultancy/Consultancy.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    ConsultancyController.listConsultancy
  )
  .get(
    "/:slugs",
    requestValidator(consultancySlugParamSchema, "params"),
    ConsultancyController.getConsultancy
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(createOrUpdateConsultancySchema, "body"),
    ConsultancyController.createOrUpdateConsultancy
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(deleteConsultancyQuerySchema, "query"),
    ConsultancyController.deleteConsultancy
  );

export default route;
