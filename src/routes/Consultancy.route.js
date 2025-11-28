import express from "express";

import ConsultancyController from "../controllers/consultancy/Consultancy.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", ConsultancyController.listConsultancy)
  .get("/:slugs", ConsultancyController.getConsultancy)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    ConsultancyController.createOrUpdateConsultancy
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    ConsultancyController.deleteConsultancy
  );

export default route;
