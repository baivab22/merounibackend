import express from "express";

import LevelController from "../controllers/level/Level.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  levelSlugParamSchema,
  createLevelSchema,
  updateLevelQuerySchema,
  updateLevelBodySchema,
  deleteLevelQuerySchema,
} from "../validators/level/Level.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    LevelController.listLevels
  )
  .get(
    "/:slugs",
    requestValidator(levelSlugParamSchema, "params"),
    LevelController.getLevel
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidator(createLevelSchema, "body"),
    LevelController.createLevel
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    requestValidator(deleteLevelQuerySchema, "query"),
    LevelController.deleteLevel
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateLevelQuerySchema, property: "query" },
      { schema: updateLevelBodySchema, property: "body" },
    ]),
    LevelController.updateLevel
  );

export default route;
