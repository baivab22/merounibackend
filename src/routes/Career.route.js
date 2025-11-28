import express from "express";

import CareerController from "../controllers/career/Career.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", CareerController.listCareers)
  .get("/:slugs", CareerController.getCareerBySlug)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    CareerController.createCareer
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    CareerController.deleteCareer
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    CareerController.updateCareer
  );

export default route;
